import moment from "moment";
import jsPDF from "jspdf";

export const pdfRelatorioItems = () => {
  var doc = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
      hotfixes: [] // an array of hotfix strings to enable
    }),
    loremipsum =
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus id eros turpis. Vivamus tempor urna vitae sapien mollis molestie. Vestibulum in lectus non enim bibendum laoreet at at libero. Etiam malesuada erat sed sem blandit in varius orci porttitor. Sed at sapien urna. Fusce augue ipsum, molestie et adipiscing at, varius quis enim. Morbi sed magna est, vel vestibulum urna. Sed tempor ipsum vel mi pretium at elementum urna tempor. Nulla faucibus consectetur felis, elementum venenatis mi mollis gravida. Aliquam mi ante, accumsan eu tempus vitae, viverra quis justo.\n\nProin feugiat augue in augue rhoncus eu cursus tellus laoreet. Pellentesque eu sapien at diam porttitor venenatis nec vitae velit. Donec ultrices volutpat lectus eget vehicula. Nam eu erat mi, in pulvinar eros. Mauris viverra porta orci, et vehicula lectus sagittis id. Nullam at magna vitae nunc fringilla posuere. Duis volutpat malesuada ornare. Nulla in eros metus. Vivamus a posuere libero.";

  // var doc = new jsPDF("p", "in", "letter"),
  //   sizes = [12, 16, 20],
  //   fonts = [
  //     ["Times", "Roman"],
  //     ["Helvetica", ""],
  //     ["Times", "Italic"]
  //   ],
  //   font,
  //   size,
  //   lines,
  //   margin = 0.5, // inches on a 8.5 x 11 inch sheet.
  //   verticalOffset = margin,
  doc
    .setDrawColor(0, 255, 0)
    .setLineWidth(1 / 72)
    .line(12.7, 12.7, 12.7, 279.4 - 12.7)
    .line(215.9 - 12.7, 12.7, 215.9 - 12.7, 279.4 - 12.7);

  var lines = doc
    .setFont("Times", "Roman")
    .setFontSize(12)
    .splitTextToSize(loremipsum, 190.5);

  doc.text(12.7, 12.7 + 12 / 72, lines);

  moment.locale("pt");

  // technician.map((tecnico, i) => {
  //   doc.setLineWidth(1).line(3, 3, 3, 18);
  //   doc.setFontSize(20);
  //   if (doc.splitTextToSize(tecnico.name, 100).length > 1) {
  //     doc.setFontSize(18);
  //     if (doc.splitTextToSize(tecnico.name, 100).length > 1) {
  //       doc.setFontSize(16);
  //       if (doc.splitTextToSize(tecnico.name, 100).length > 1) {
  //         doc.setFontSize(14);
  //       }
  //     }
  //   }
  //   doc.text(5, 13, moment(data).format("L")).text(50, 13, tecnico.name);

  //   doc.setLineWidth(0.1).line(150, 12, 280, 12);
  //   doc.setFontSize(12).text(150, 17, "Assinatura");

  //   doc
  //     .setFontSize(18)
  //     .text(3, 28, `${tecnico.plate} Rodízio: ${getRodizio(tecnico.plate)}`);

  //   doc
  //     .setFontSize(14)
  //     .text(100, 28, "Horário saída:")
  //     .text(190, 28, "Horário retorno:");
  //   doc
  //     .setLineWidth(0.1)
  //     .line(132, 28, 182, 28)
  //     .line(230, 28, 280, 28);

  //   let index = 0;

  //   title(doc);

  //   tecnico.rows &&
  //     tecnico.rows.map(item => {
  //       if (R.has("products", item)) {
  //         item.products.map(product => {
  //           const textEquip = `${product.amount} - ${product.name} ${
  //             product.serial
  //               ? `Nº (${product.serialNumbers.map((equip, index) =>
  //                   index > 0 ? ` ${equip.serialNumber}` : equip.serialNumber
  //                 )})`
  //               : ""
  //           }`;

  //           const rows = R.max(
  //             doc.splitTextToSize(item.razaoSocial, 95).length,
  //             doc.splitTextToSize(product.status.toUpperCase(), 35).length,
  //             doc.splitTextToSize(textEquip, 100).length
  //           );

  //           if (index + rows < 22) {
  //             addWrappedText({
  //               text: item.razaoSocial, // Put a really long string here
  //               textWidth: 95,
  //               doc,
  //               fontSize: "12",
  //               fontType: "normal",
  //               lineSpacing: 5, // Space between lines
  //               xPosition: 5, // Text offset from left of document
  //               initialYPosition: 47, // Initial offset from top of document; set based on prior objects in document
  //               pageWrapInitialYPosition: 10, // Initial offset from top of document when page-wrapping
  //               index,
  //               rows
  //             });

  //             addWrappedText({
  //               text: product.status.toUpperCase(), // Put a really long string here
  //               textWidth: 35,
  //               doc,
  //               fontSize: "12",
  //               fontType: "normal",
  //               lineSpacing: 5, // Space between lines
  //               xPosition: 100, // Text offset from left of document
  //               initialYPosition: 47, // Initial offset from top of document; set based on prior objects in document
  //               pageWrapInitialYPosition: 10, // Initial offset from top of document when page-wrapping
  //               index,
  //               rows
  //             });

  //             addWrappedText({
  //               text: textEquip, // Put a really long string here
  //               textWidth: 100,
  //               doc,
  //               fontSize: "12",
  //               fontType: "normal",
  //               lineSpacing: 5, // Space between lines
  //               xPosition: 135, // Text offset from left of document
  //               initialYPosition: 47, // Initial offset from top of document; set based on prior objects in document
  //               pageWrapInitialYPosition: 10, // Initial offset from top of document when page-wrapping
  //               index,
  //               rows
  //             });

  //             addWrappedText({
  //               text: "", // Put a really long string here
  //               textWidth: 50,
  //               doc,
  //               fontSize: "12",
  //               fontType: "normal",
  //               lineSpacing: 5, // Space between lines
  //               xPosition: 235, // Text offset from left of document
  //               initialYPosition: 47, // Initial offset from top of document; set based on prior objects in document
  //               pageWrapInitialYPosition: 10, // Initial offset from top of document when page-wrapping
  //               index,
  //               rows
  //             });
  //           }

  //           index = index + rows;
  //           // eslint-disable-next-line array-callback-return
  //           return;
  //         });
  //       } else {
  //         const rows = R.max(
  //           doc.splitTextToSize(item.razaoSocial, 95).length,
  //           doc.splitTextToSize("EMPRÉSTIMO", 35).length,
  //           doc.splitTextToSize(`1 - ${item.name} Nº ${item.serialNumber}`, 100)
  //             .length
  //         );

  //         if (index + rows < 22) {
  //           addWrappedText({
  //             text: item.razaoSocial, // Put a really long string here
  //             textWidth: 95,
  //             doc,
  //             fontSize: "12",
  //             fontType: "normal",
  //             lineSpacing: 5, // Space between lines
  //             xPosition: 5, // Text offset from left of document
  //             initialYPosition: 47, // Initial offset from top of document; set based on prior objects in document
  //             pageWrapInitialYPosition: 10, // Initial offset from top of document when page-wrapping
  //             index,
  //             rows
  //           });

  //           addWrappedText({
  //             text: "EMPRESTIMO", // Put a really long string here
  //             textWidth: 35,
  //             doc,
  //             fontSize: "12",
  //             fontType: "normal",
  //             lineSpacing: 5, // Space between lines
  //             xPosition: 100, // Text offset from left of document
  //             initialYPosition: 47, // Initial offset from top of document; set based on prior objects in document
  //             pageWrapInitialYPosition: 10, // Initial offset from top of document when page-wrapping
  //             index,
  //             rows
  //           });

  //           addWrappedText({
  //             text: `1 - ${item.name}  Nº ${item.serialNumber}`, // Put a really long string here
  //             textWidth: 100,
  //             doc,
  //             fontSize: "12",
  //             fontType: "normal",
  //             lineSpacing: 5, // Space between lines
  //             xPosition: 135, // Text offset from left of document
  //             initialYPosition: 47, // Initial offset from top of document; set based on prior objects in document
  //             pageWrapInitialYPosition: 10, // Initial offset from top of document when page-wrapping
  //             index,
  //             rows
  //           });

  //           addWrappedText({
  //             text: "", // Put a really long string here
  //             textWidth: 50,
  //             doc,
  //             fontSize: "12",
  //             fontType: "normal",
  //             lineSpacing: 5, // Space between lines
  //             xPosition: 235, // Text offset from left of document
  //             initialYPosition: 47, // Initial offset from top of document; set based on prior objects in document
  //             pageWrapInitialYPosition: 10, // Initial offset from top of document when page-wrapping
  //             index,
  //             rows
  //           });
  //         }

  //         index = index + rows;
  //       }
  //       // eslint-disable-next-line array-callback-return
  //       return;
  //     });

  //   i < technician.length - 1 && doc.addPage();
  //   // eslint-disable-next-line array-callback-return
  //   return;
  // });

  // doc.autoPrint();
  // window.print();

  doc.save(`${moment().format("L")}.pdf`);
};
