import {useMemo} from "react";

export function GET_COLUMNS_USER_ADMIN_ON_APP() {
    return useMemo(
        () => [
            {
                Header: 'ID usuário',
                accessor: 'id_usuario'
            },
            {
                Header: 'Nome',
                accessor: 'usuario_nome'
            },
            {
                Header: 'CPF',
                accessor: 'usuario_documento'
            },
            {
                Header: 'E-mail',
                accessor: 'usuario_email'
            }, {
                Header: 'Telefone',
                accessor: 'usuario_telefone'
            },
            {
                Header: 'CEP',
                accessor: 'cep'
            },
            {
                Header: 'Criação',
                accessor: 'usuario_dh_criacao'
            }
        ],
        []
    )
}

export function GET_COLUMNS_CATEGORY() {
    return useMemo(
        () => [
            {
                Header: 'Nome',
                accessor: 'categoria_nome'
            },
            {
                Header: 'Descrição',
                accessor: 'categoria_descricao'
            }
        ],
        []
    )
}

export function GET_COLUMNS_EXPENSE() {
    return [
        {
            Header: 'Categoria',
            accessor: 'categoria_despesa'
        },
        {
            Header: 'Descrição',
            accessor: 'descricao_despesa'
        },
        {
            Header: 'Tipo Despesa',
            accessor: 'tipo_despesa'
        },
        {
            Header: 'Parcela Atual',
            accessor: 'parcela_atual'
        },
        {
            Header: 'Parcela Total',
            accessor: 'parcela_total'
        },
        {
            Header: 'Valor',
            accessor: 'valor_despesa'
        },
        {
            Header: 'Data',
            accessor: 'data_despesa'
        },
    ]
}