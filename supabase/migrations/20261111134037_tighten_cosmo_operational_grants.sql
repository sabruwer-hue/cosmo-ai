-- Enforce append-only package release and task-event records; deny all deletes.
revoke all on table public.cosmo_packages, public.cosmo_package_releases, public.cosmo_agent_tasks, public.cosmo_task_steps, public.cosmo_task_events, public.cosmo_agent_approvals from anon, public, authenticated;
grant select, insert, update on public.cosmo_packages to authenticated;
grant select, insert on public.cosmo_package_releases to authenticated;
grant select, insert, update on public.cosmo_agent_tasks to authenticated;
grant select, insert, update on public.cosmo_task_steps to authenticated;
grant select, insert on public.cosmo_task_events to authenticated;
grant select, insert, update on public.cosmo_agent_approvals to authenticated;
