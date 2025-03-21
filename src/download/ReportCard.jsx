import { jsPDF } from "jspdf"; // Import jsPDF
import autoTable from "jspdf-autotable"; // Import autoTable separately
import logo from "../assets/mainlogo.png"; // Import the logo

const ReportCard = {
  generatePDF: (studentData) => {
    const doc = new jsPDF();

    doc.addImage(logo, "PNG", 10, 10, 30, 20); // Adjust size and position as needed

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Parishrama NEET Academy", 50, 15);
    doc.setFont("helvetica", "normal");
    doc.text("Omkar Hills, Dr. Vishnuvardan Road, Uttarahalli Main Road, Bengaluru - 560060", 50, 22);
    doc.text("Phone: 080-45912222, Email: officeparishrama@gmail.com", 50, 29);

    doc.setDrawColor(0); // Black color
    doc.setLineWidth(0.5); // Line width
    doc.line(10, 35, 200, 35); // Draw a line from (x1, y1) to (x2, y2)

    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Progress Report Card", 70, 45);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${studentData.studentName}`, 10, 55);
    doc.text(`Reg No: ${studentData.rollNo}`, 10, 65);
    doc.text(`Tests Attended: ${studentData.totalTestsAttended}`, 10, 75);

    let startY = 85;

    const groupedTests = {};
    Object.entries(studentData.tests).forEach(([testType, testEntries]) => {
      if (!groupedTests[testType]) {
        groupedTests[testType] = [];
      }
      groupedTests[testType].push(...testEntries);
    });

    Object.entries(groupedTests).forEach(([testName, testEntries]) => {
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.text(`${testName}`, 15, startY);
      startY += 10;

      const tableData = testEntries.map((test) => [
        test.date,
        test.subjects.Botany,
        test.subjects.Chemistry,
        test.subjects.Physics,
        test.subjects.Zoology,
      ]);

      const totalMarks = testEntries.reduce((sum, test) => {
        return sum + test.subjects.Botany + test.subjects.Chemistry + test.subjects.Physics + test.subjects.Zoology;
      }, 0);

      const totalPossibleMarks = testEntries.length * 720; // 180 marks per subject * 4 subjects
      const percentage = ((totalMarks / totalPossibleMarks) * 100).toFixed(2);

      const averageMarks = (totalMarks / testEntries.length).toFixed(2);

      tableData.push(["Total Marks Obtained", totalMarks, "", "", ""]);
      tableData.push(["Average Marks", averageMarks, "", "", ""]);
      tableData.push(["Percentage", `${percentage}%`, "", "", ""]);

      autoTable(doc, {
        startY,
        head: [["Date", "Botany", "Chemistry", "Physics", "Zoology"]],
        body: tableData,
        theme: "grid",
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [255, 165, 0] },
      });

      startY = doc.lastAutoTable.finalY + 10;
    });

    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Total Marks: ${studentData.totalMarks}`, 10, startY);
    doc.text(`Average Marks: ${studentData.averageMarks.toFixed(2)}`, 10, startY + 10);

    doc.save(`${studentData.studentName}_ReportCard.pdf`);
  },
};

export default ReportCard;