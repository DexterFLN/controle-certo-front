import React from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
const GeneratePdf = () => {
    function downloadPdf() {
        const formattedDate = format(new Date(), 'dd/MM/yyyy');
        const document = new jsPDF();
        console.log('pdf');
        document.text('Relatório despesas - ' + formattedDate, 20, 10);
        document.save(`controle_certo_${formattedDate}.pdf`);
    }
    return (
        <div>
            <button onClick={downloadPdf}>Download</button>
        </div>
    );
};

export default GeneratePdf;
