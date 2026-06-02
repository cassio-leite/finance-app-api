create or replace function get_user_balance(uid UUID)
returns table (
	earnings NUMERIC(10, 2),
	expenses NUMERIC(10, 2),
	investments NUMERIC(10, 2),
	balance NUMERIC(10, 2)
) as $$
begin
	return query
	select
		SUM(case when type = 'EARNING' then amount else 0 end) as earnings,
		SUM(case when type = 'EXPENSE' then amount else 0 end) as expenses,
		SUM(case when type = 'INVESTMENT' then amount else 0 end) as investments,
	
		(SUM(case when type = 'EARNING' then amount else 0 end) -
		(SUM(case when type = 'EXPENSE' then amount else 0 end) +
		SUM(case when type = 'INVESTMENT' then amount else 0 end))) as balance
	from transactions
	where user_id = get_user_balance.uid;
end; $$
	language plpgsql;
		