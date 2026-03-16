-- Create a function to increment the vote count on a report.
-- This is more performant and safer than fetching and updating in the server.

create or replace function increment_vote_count(report_id_to_update uuid, column_to_increment text)
returns void as $$
begin
  execute format(
    'update public.reports set %I = %I + 1 where id = %L',
    column_to_increment,
    column_to_increment,
    report_id_to_update
  );
end;
$$ language plpgsql;
