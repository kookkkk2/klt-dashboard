-- ============================================================
-- KLT 콘텐츠 파이프라인 업그레이드 (2026-07-07)
-- 실행 위치: Supabase Dashboard > SQL Editor
-- 목적:
--   1) 발행일(published_date)과 등록일(created_date) 분리
--   2) 카드뉴스 게시일 컬럼 추가
--   3) 채널별 파일 생성 여부 플래그 추가
--   4) 테마(해결사/전문가/관리자/파트너), 폴더명 추가
--   5) 로그인 팀원이 콘텐츠 승인/게시일 입력 가능하도록 정책 보강
-- ============================================================

-- 1) 컬럼 추가 (이미 있으면 무시됨)
alter table content_master add column if not exists theme          text;            -- 해결사/전문가/관리자/파트너
alter table content_master add column if not exists published_date date;            -- 발행일 = 검수 승인일 (승인 버튼 클릭 시 자동)
alter table content_master add column if not exists cardnews_date  date;            -- 카드뉴스 게시일 (수동 입력)
alter table content_master add column if not exists folder_name    text;            -- contents/ 하위 폴더명

-- 채널별 파일 생성 플래그 (파일이 실제로 만들어졌는지만 표시)
alter table content_master add column if not exists main_file       boolean default false;
alter table content_master add column if not exists blog_file       boolean default false;
alter table content_master add column if not exists linkedin_file   boolean default false;
alter table content_master add column if not exists remember_file   boolean default false;
alter table content_master add column if not exists newsletter_file boolean default false;
alter table content_master add column if not exists cardnews_file   boolean default false;

-- 2) RLS 정책: 로그인 팀원 누구나 콘텐츠 등록/수정 가능
--    (승인 버튼, 게시일 수동 입력이 대시보드에서 동작하려면 필요)
drop policy if exists "authenticated_insert_content" on content_master;
create policy "authenticated_insert_content"
  on content_master for insert
  to authenticated
  with check (true);

drop policy if exists "authenticated_update_content" on content_master;
create policy "authenticated_update_content"
  on content_master for update
  to authenticated
  using (true)
  with check (true);

-- 3) 확인용 조회
select column_name, data_type
from information_schema.columns
where table_name = 'content_master'
order by ordinal_position;
