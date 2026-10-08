export const CATEGORIES=['Moradia','Alimentação','Transporte','Lazer','Saúde','Outros'];
export function parseAmount(value){
 const s=String(value).trim();if(!/^(?:\d{1,3}(?:\.\d{3})+|\d+)(?:,\d{1,2})?$/.test(s))throw Error('Use um valor como 125,90.');
 const [whole,decimal='']=s.replaceAll('.','').split(',');const cents=Number(whole)*100+Number(decimal.padEnd(2,'0'));if(!Number.isSafeInteger(cents)||cents<=0||cents>100000000)throw Error('Informe um valor entre R$ 0,01 e R$ 1.000.000,00.');return cents;
}
export function validateTransaction(input){
 const description=String(input.description||'').trim();if(!description||description.length>80)throw Error('Descreva a movimentação em até 80 caracteres.');
 if(!['INCOME','EXPENSE'].includes(input.type))throw Error('Escolha receita ou despesa.');
 if(!/^2026-(09|10)-\d{2}$/.test(input.date)||new Date(input.date+'T12:00:00Z').toISOString().slice(0,10)!==input.date)throw Error('Escolha uma data válida de setembro ou outubro de 2026.');
 if(input.type==='EXPENSE'&&!CATEGORIES.includes(input.category))throw Error('Escolha uma categoria.');
 return {description,date:input.date,type:input.type,category:input.type==='INCOME'?'Receitas':input.category,cents:parseAmount(input.amount)};
}
export function summarize(rows,month){const selected=rows.filter(r=>r.date.startsWith(month));const income=selected.filter(r=>r.type==='INCOME').reduce((s,r)=>s+r.cents,0);const expense=selected.filter(r=>r.type==='EXPENSE').reduce((s,r)=>s+r.cents,0);const categories=CATEGORIES.map(name=>({name,cents:selected.filter(r=>r.type==='EXPENSE'&&r.category===name).reduce((s,r)=>s+r.cents,0)})).filter(x=>x.cents).sort((a,b)=>b.cents-a.cents);return {income,expense,net:income-expense,categories};}
export function seed(){const tx=[
 ['2026-10-01','Receita de exemplo','INCOME','Receitas',720000],['2026-10-02','Aluguel','EXPENSE','Moradia',180000],['2026-10-03','Supermercado','EXPENSE','Alimentação',48690],['2026-10-04','Transporte do mês','EXPENSE','Transporte',22000],['2026-10-05','Cinema e jantar','EXPENSE','Lazer',16800],['2026-10-06','Farmácia','EXPENSE','Saúde',8950],['2026-10-07','Feira','EXPENSE','Alimentação',12750],['2026-10-08','Projeto extra','INCOME','Receitas',65000],
 ['2026-09-01','Receita de exemplo','INCOME','Receitas',680000],['2026-09-02','Aluguel','EXPENSE','Moradia',180000],['2026-09-05','Supermercado','EXPENSE','Alimentação',61500],['2026-09-08','Transporte do mês','EXPENSE','Transporte',26500],['2026-09-12','Passeio de fim de semana','EXPENSE','Lazer',24500],['2026-09-18','Farmácia','EXPENSE','Saúde',11300]
 ];return tx.map(([date,description,type,category,cents],i)=>({id:'example-'+i,date,description,type,category,cents}));}
