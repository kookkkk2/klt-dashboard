#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KLT 콘텐츠 파이프라인 — Supabase content_master 기록 스크립트
사용 전제: 리포지토리 루트 .env 에 SUPABASE_URL, SUPABASE_SERVICE_KEY 설정

명령:
  python3 scripts/content_db.py list
  python3 scripts/content_db.py register --id C2607-01 --title "제목" --theme 해결사 --folder C2607-01_slug
  python3 scripts/content_db.py approve  --id C2607-01        # 승인 + 발행일(published_date) 오늘로
  python3 scripts/content_db.py reject   --id C2607-01
  python3 scripts/content_db.py flag     --id C2607-01 --files blog,linkedin,remember,newsletter,cardnews

네트워크가 차단된 환경(샌드박스 등)에서는 자동으로 contents/_pending_sql/ 에
붙여넣기용 SQL 파일을 생성한다. → Supabase SQL Editor에서 실행하면 동일 결과.
"""
import argparse, datetime, json, os, sys, urllib.request, urllib.error

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FILE_FIELDS = ["main", "blog", "linkedin", "remember", "newsletter", "cardnews"]

def load_env():
    env = {}
    p = os.path.join(ROOT, ".env")
    if os.path.exists(p):
        for line in open(p, encoding="utf-8"):
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip()
    return env

def sql_escape(v):
    if v is None: return "null"
    if isinstance(v, bool): return "true" if v else "false"
    return "'" + str(v).replace("'", "''") + "'"

def write_pending_sql(action, sql):
    d = os.path.join(ROOT, "contents", "_pending_sql")
    os.makedirs(d, exist_ok=True)
    ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    path = os.path.join(d, f"{ts}_{action}.sql")
    with open(path, "w", encoding="utf-8") as f:
        f.write("-- Supabase SQL Editor에 붙여넣어 실행하세요\n" + sql + "\n")
    print(f"[폴백] 네트워크 불가 → SQL 파일 생성: {os.path.relpath(path, ROOT)}")

def api(env, method, path, body=None, params=""):
    url = f"{env['SUPABASE_URL']}/rest/v1/{path}{params}"
    req = urllib.request.Request(url, method=method,
        data=json.dumps(body).encode() if body is not None else None,
        headers={
            "apikey": env["SUPABASE_SERVICE_KEY"],
            "Authorization": f"Bearer {env['SUPABASE_SERVICE_KEY']}",
            "Content-Type": "application/json",
            "Prefer": "return=representation",
        })
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode() or "[]")

def run(args):
    today = datetime.date.today().isoformat()
    env = load_env()
    has_key = env.get("SUPABASE_URL") and env.get("SUPABASE_SERVICE_KEY") \
              and "여기에" not in env.get("SUPABASE_SERVICE_KEY", "")

    if args.cmd == "register":
        row = {"id": args.id, "title": args.title, "theme": args.theme,
               "review_status": "대기", "created_date": today,
               "folder_name": args.folder, "main_file": True}
        sql = ("insert into content_master (id,title,theme,review_status,created_date,folder_name,main_file)\n"
               f"values ({sql_escape(args.id)},{sql_escape(args.title)},{sql_escape(args.theme)},'대기','{today}',{sql_escape(args.folder)},true);")
        action, body, params = "PATCH?", row, None
        if has_key:
            try:
                res = api(env, "POST", "content_master", row)
                print("등록 완료:", res[0].get("id"), "-", res[0].get("title")); return
            except Exception as e:
                print(f"[경고] API 실패({e}) → SQL 폴백")
        write_pending_sql(f"register_{args.id}", sql); return

    if args.cmd in ("approve", "reject"):
        if args.cmd == "approve":
            patch = {"review_status": "승인", "published_date": today}
            sql = f"update content_master set review_status='승인', published_date='{today}' where id={sql_escape(args.id)};"
        else:
            patch = {"review_status": "반려"}
            sql = f"update content_master set review_status='반려' where id={sql_escape(args.id)};"
        if has_key:
            try:
                res = api(env, "PATCH", "content_master", patch, f"?id=eq.{args.id}")
                print(f"{args.cmd} 완료:", res[0].get("id"), "→", res[0].get("review_status")); return
            except Exception as e:
                print(f"[경고] API 실패({e}) → SQL 폴백")
        write_pending_sql(f"{args.cmd}_{args.id}", sql); return

    if args.cmd == "flag":
        files = [f.strip() for f in args.files.split(",") if f.strip()]
        bad = [f for f in files if f not in FILE_FIELDS]
        if bad: sys.exit(f"알 수 없는 채널: {bad} (가능: {FILE_FIELDS})")
        patch = {f + "_file": True for f in files}
        sets = ", ".join(f"{f}_file=true" for f in files)
        sql = f"update content_master set {sets} where id={sql_escape(args.id)};"
        if has_key:
            try:
                api(env, "PATCH", "content_master", patch, f"?id=eq.{args.id}")
                print("파일 플래그 기록 완료:", args.id, "→", files); return
            except Exception as e:
                print(f"[경고] API 실패({e}) → SQL 폴백")
        write_pending_sql(f"flag_{args.id}", sql); return

    if args.cmd == "list":
        if has_key:
            try:
                rows = api(env, "GET", "content_master", None,
                           "?select=id,title,theme,review_status,created_date,published_date&order=created_date.desc&limit=20")
                for r in rows:
                    print(f"{r.get('id')} | {r.get('review_status')} | 등록 {r.get('created_date')} | 발행 {r.get('published_date') or '-'} | {r.get('title')}")
                return
            except Exception as e:
                print(f"[경고] API 실패: {e}")
        print("키 미설정 또는 네트워크 불가 — 대시보드 '콘텐츠 관리' 탭에서 확인하세요.")

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    r = sub.add_parser("register"); r.add_argument("--id", required=True); r.add_argument("--title", required=True); r.add_argument("--theme", required=True); r.add_argument("--folder", required=True)
    a = sub.add_parser("approve"); a.add_argument("--id", required=True)
    j = sub.add_parser("reject");  j.add_argument("--id", required=True)
    f = sub.add_parser("flag");    f.add_argument("--id", required=True); f.add_argument("--files", required=True)
    sub.add_parser("list")
    run(p.parse_args())
