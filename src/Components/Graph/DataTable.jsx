import React from 'react';
import {useTable, useSortBy, usePagination} from 'react-table';
import {FaSort, FaSortUp, FaSortDown, FaTrash, FaFilePdf} from 'react-icons/fa';
import ReactPaginate from 'react-paginate';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './DataTable.css';
import {format} from 'date-fns';

const DataTable = ({columns, data, deleteRow, rowIdAccessor, pdfHeaderTitle}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageIndex, pageSize}
    } = useTable(
        {
            columns,
            data,
            initialState: {pageIndex: 0, pageSize: 5}
        },
        useSortBy,
        usePagination
    );

    const exportPDF = () => {
        const formattedDate = format(new Date(), 'dd/MM/yyyy HH:mm:ss');
        const doc = new jsPDF();
        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.text(pdfHeaderTitle, 14, 22);
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text(`Dados referentes a: ${formattedDate}`, 14, 30);

        doc.autoTable({
            startY: 40,
            head: [columns.map(col => col.Header)],
            body: data.map(row => columns.map(col => row[col.accessor]))
        });
        doc.save(`controle-certo-${formattedDate}.pdf`);
    };

    return (
        <div className="table-container">
            <div className="table-controls">
                <button onClick={exportPDF} className="pdf-button">
                    <FaFilePdf/> Exportar para PDF
                </button>
                <select
                    value={pageSize}
                    onChange={e => setPageSize(Number(e.target.value))}
                    className="page-size-select"
                >
                    {[5, 10, 20, 50].map(size => (
                        <option key={size} value={size}>
                            Exibir {size}
                        </option>
                    ))}
                </select>
            </div>
            <table {...getTableProps()} className="table">
                <thead>
                {headerGroups.map((headerGroup, headerGroupIndex) => (
                    <tr {...headerGroup.getHeaderGroupProps()} key={`headerGroup-${headerGroupIndex}`}>
                        {headerGroup.headers.map((column, columnIndex) => {
                            const {key, ...columnProps} = column.getHeaderProps(column.getSortByToggleProps());
                            return (
                                <th key={`column-${columnIndex}`} {...columnProps}>
                                    {column.render('Header')}
                                    <span>{column.isSorted ? column.isSortedDesc ? <FaSortDown/> : <FaSortUp/> :
                                        <FaSort/>}</span>
                                </th>
                            );
                        })}
                        <th className="actions-header">Ações</th>
                    </tr>
                ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                {page.map((row, i) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                <td
                                    {...cell.getCellProps()}
                                >
                                    {cell.render('Cell')}
                                </td>
                            ))}
                            <td className="actions-cell">
                                <button onClick={() => deleteRow(row.original[rowIdAccessor])}
                                        className="delete-button">
                                    <FaTrash/>
                                </button>
                            </td>
                        </tr>
                    );
                })}
                </tbody>
            </table>
            <div className="pagination-container">
                <ReactPaginate
                    previousLabel={'anterior'}
                    nextLabel={'próximo'}
                    breakLabel={'...'}
                    breakClassName={'break-me'}
                    pageCount={pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={({selected}) => gotoPage(selected)}
                    containerClassName={'pagination'}
                    subContainerClassName={'pages pagination'}
                    activeClassName={'active'}
                />
            </div>
        </div>
    );
};

export default DataTable;
