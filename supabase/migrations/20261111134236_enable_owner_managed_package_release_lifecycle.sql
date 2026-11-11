grant update on public.cosmo_package_releases to authenticated;
create policy "cosmo_package_releases_update_own" on public.cosmo_package_releases for update to authenticated using ((select auth.uid()) = owner_id) with check ((select auth.uid()) = owner_id);
