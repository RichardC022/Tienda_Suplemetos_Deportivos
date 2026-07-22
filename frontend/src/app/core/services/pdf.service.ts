import { Injectable } from '@angular/core';
import { jsPDF } from 'jspdf';

@Injectable({ providedIn: 'root' })
export class PdfService {

  informeCompras(compras: any[]): void {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Informe de Compras', pageW / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SysSupplementsGym', pageW / 2, 28, { align: 'center' });
    doc.text('Fecha: ' + new Date().toLocaleDateString('es-ES'), pageW / 2, 34, { align: 'center' });

    const totalGeneral = compras.reduce((sum, c) => sum + (c.total || 0), 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total de registros: ${compras.length}`, 14, 46);
    doc.text(`Total general: $${totalGeneral.toFixed(2)}`, 14, 53);

    const headers = ['ID', 'Fecha', 'Total', 'Metodo Pago', 'Persona'];
    const colX = [14, 30, 80, 110, 150];
    const startY = 65;
    const rowH = 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    headers.forEach((h, i) => doc.text(h, colX[i], startY));

    doc.setDrawColor(0);
    doc.line(14, startY + 2, pageW - 14, startY + 2);

    doc.setFont('helvetica', 'normal');
    let y = startY + rowH + 2;

    compras.forEach((c) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
        doc.setFont('helvetica', 'bold');
        headers.forEach((h, i) => doc.text(h, colX[i], y));
        doc.line(14, y + 2, pageW - 14, y + 2);
        doc.setFont('helvetica', 'normal');
        y += rowH + 2;
      }
      doc.text(String(c.id ?? '-'), colX[0], y);
      const fecha = c.fecha ? new Date(c.fecha).toLocaleDateString('es-ES') : '-';
      doc.text(fecha, colX[1], y);
      doc.text(`$${(c.total || 0).toFixed(2)}`, colX[2], y);
      doc.text(c.metodoPago || '-', colX[3], y);
      doc.text(c.persona?.nombre || '-', colX[4], y);
      y += rowH;
    });

    doc.save('informe_compras.pdf');
  }

  informeVentasManuales(compras: any[]): void {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Informe de Ventas Manuales', pageW / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SysSupplementsGym', pageW / 2, 28, { align: 'center' });
    doc.text('Fecha: ' + new Date().toLocaleDateString('es-ES'), pageW / 2, 34, { align: 'center' });

    const totalGeneral = compras.reduce((sum, c) => sum + (c.total || 0), 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total de registros: ${compras.length}`, 14, 46);
    doc.text(`Total general: $${totalGeneral.toFixed(2)}`, 14, 53);

    const headers = ['ID', 'Fecha', 'Factura', 'Cliente', 'Cedula', 'Metodo', 'Total'];
    const colX = [14, 28, 50, 75, 120, 148, 175];
    const startY = 65;
    const rowH = 8;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    headers.forEach((h, i) => doc.text(h, colX[i], startY));

    doc.setDrawColor(0);
    doc.line(14, startY + 2, pageW - 14, startY + 2);

    doc.setFont('helvetica', 'normal');
    let y = startY + rowH + 2;

    compras.forEach((c) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
        doc.setFont('helvetica', 'bold');
        headers.forEach((h, i) => doc.text(h, colX[i], y));
        doc.line(14, y + 2, pageW - 14, y + 2);
        doc.setFont('helvetica', 'normal');
        y += rowH + 2;
      }
      doc.text(String(c.id ?? '-'), colX[0], y);
      const fecha = c.fecha ? new Date(c.fecha).toLocaleDateString('es-ES') : '-';
      doc.text(fecha, colX[1], y);
      doc.text(c.numeroFactura || '-', colX[2], y);
      const cliente = c.persona ? `${c.persona.nombre || ''} ${c.persona.apellido || ''}`.trim() : '-';
      doc.text(cliente.substring(0, 20), colX[3], y);
      doc.text(c.persona?.documento || '-', colX[4], y);
      doc.text(c.metodoPago || '-', colX[5], y);
      doc.text(`$${(c.total || 0).toFixed(2)}`, colX[6], y);
      y += rowH;
    });

    doc.save('informe_ventas_manuales.pdf');
  }

  informeVentasOnline(compras: any[]): void {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Informe de Ventas en Linea', pageW / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SysSupplementsGym', pageW / 2, 28, { align: 'center' });
    doc.text('Fecha: ' + new Date().toLocaleDateString('es-ES'), pageW / 2, 34, { align: 'center' });

    const totalGeneral = compras.reduce((sum, c) => sum + (c.total || 0), 0);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total de registros: ${compras.length}`, 14, 46);
    doc.text(`Total general: $${totalGeneral.toFixed(2)}`, 14, 53);

    const headers = ['ID', 'Fecha', 'Cliente', 'Metodo', 'Total'];
    const colX = [14, 30, 70, 130, 170];
    const startY = 65;
    const rowH = 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    headers.forEach((h, i) => doc.text(h, colX[i], startY));

    doc.setDrawColor(0);
    doc.line(14, startY + 2, pageW - 14, startY + 2);

    doc.setFont('helvetica', 'normal');
    let y = startY + rowH + 2;

    compras.forEach((c) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
        doc.setFont('helvetica', 'bold');
        headers.forEach((h, i) => doc.text(h, colX[i], y));
        doc.line(14, y + 2, pageW - 14, y + 2);
        doc.setFont('helvetica', 'normal');
        y += rowH + 2;
      }
      doc.text(String(c.id ?? '-'), colX[0], y);
      const fecha = c.fecha ? new Date(c.fecha).toLocaleDateString('es-ES') : '-';
      doc.text(fecha, colX[1], y);
      doc.text(c.persona?.nombre || 'Cliente', colX[2], y);
      doc.text(c.metodoPago || '-', colX[3], y);
      doc.text(`$${(c.total || 0).toFixed(2)}`, colX[4], y);
      y += rowH;
    });

    doc.save('informe_ventas_online.pdf');
  }

  informeInventario(inventarios: any[]): void {
    const doc = new jsPDF();
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('Informe de Inventario', pageW / 2, 20, { align: 'center' });

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('SysSupplementsGym', pageW / 2, 28, { align: 'center' });
    doc.text('Fecha: ' + new Date().toLocaleDateString('es-ES'), pageW / 2, 34, { align: 'center' });

    const totalStock = inventarios.reduce((sum, i) => sum + (i.stock || 0), 0);
    const agotados = inventarios.filter(i => i.stock === 0).length;
    const stockBajo = inventarios.filter(i => i.stock > 0 && i.stock <= i.stockMin).length;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Total registros: ${inventarios.length}`, 14, 46);
    doc.text(`Stock total: ${totalStock}`, 14, 53);
    doc.text(`Agotados: ${agotados}`, 14, 60);
    doc.text(`Stock bajo: ${stockBajo}`, 100, 46);

    const headers = ['ID', 'Producto', 'Stock', 'Stock Min.', 'Estado'];
    const colX = [14, 30, 100, 130, 160];
    const startY = 72;
    const rowH = 8;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    headers.forEach((h, i) => doc.text(h, colX[i], startY));

    doc.line(14, startY + 2, pageW - 14, startY + 2);

    doc.setFont('helvetica', 'normal');
    let y = startY + rowH + 2;

    inventarios.forEach((inv) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
        doc.setFont('helvetica', 'bold');
        headers.forEach((h, i) => doc.text(h, colX[i], y));
        doc.line(14, y + 2, pageW - 14, y + 2);
        doc.setFont('helvetica', 'normal');
        y += rowH + 2;
      }
      doc.text(String(inv.id ?? '-'), colX[0], y);
      doc.text(inv.producto?.nombre || '-', colX[1], y);
      doc.text(String(inv.stock ?? 0), colX[2], y);
      doc.text(String(inv.stockMin ?? 0), colX[3], y);
      let estado = 'OK';
      if (inv.stock === 0) estado = 'Agotado';
      else if (inv.stock <= inv.stockMin) estado = 'Stock Bajo';
      doc.text(estado, colX[4], y);
      y += rowH;
    });

    doc.save('informe_inventario.pdf');
  }
}
