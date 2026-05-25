export class ReportGenerator {
  constructor(database) {
    this.db = database;
  }

  generateReport(reportType, user, items) {
    let report = this.generateHeader(reportType, user);

    const processedItems = this.filterItemsByUser(user, items);

    const total = this.calculateTotal(processedItems);

    report += this.generateBody(reportType, user, processedItems);

    report += this.generateFooter(reportType, total);

    return report.trim();
  }

  generateHeader(reportType, user) {
    if (reportType === 'CSV') {
      return 'ID,NOME,VALOR,USUARIO\n';
    }

    if (reportType === 'HTML') {
      return (
        '<html><body>\n' +
        '<h1>Relatório</h1>\n' +
        `<h2>Usuário: ${user.name}</h2>\n` +
        '<table>\n' +
        '<tr><th>ID</th><th>Nome</th><th>Valor</th></tr>\n'
      );
    }

    return '';
  }

  filterItemsByUser(user, items) {
    if (user.role === 'ADMIN') {
      return items.map(item => ({
        ...item,
        priority: item.value > 1000
      }));
    }

    if (user.role === 'USER') {
      return items.filter(item => item.value <= 500);
    }

    return [];
  }

  generateBody(reportType, user, items) {
    let report = '';

    for (const item of items) {
      if (reportType === 'CSV') {
        report += this.generateCsvRow(item, user);
      }

      if (reportType === 'HTML') {
        report += this.generateHtmlRow(item);
      }
    }

    return report;
  }

  generateCsvRow(item, user) {
    return `${item.id},${item.name},${item.value},${user.name}\n`;
  }

  generateHtmlRow(item) {
    const rowTag = item.priority
      ? '<tr style="font-weight:bold;">'
      : '<tr>';

    return `${rowTag}<td>${item.id}</td><td>${item.name}</td><td>${item.value}</td></tr>\n`;
  }

  calculateTotal(items) {
    return items.reduce((total, item) => total + item.value, 0);
  }

  generateFooter(reportType, total) {
    if (reportType === 'CSV') {
      return `\nTotal,,\n${total},,\n`;
    }

    if (reportType === 'HTML') {
      return (
        '</table>\n' +
        `<h3>Total: ${total}</h3>\n` +
        '</body></html>\n'
      );
    }

    return '';
  }
}