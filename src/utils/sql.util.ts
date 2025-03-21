export function injectParametersIntoSql(sql: string, parameters: any[]): string {
  let fullSql = sql;
  parameters.forEach((param) => {
    const placeholder = `?`;
    fullSql = fullSql.replace(placeholder, typeof param === 'string' ? `'${param}'` : param);
  });
  return fullSql;
}