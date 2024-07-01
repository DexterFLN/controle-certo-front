import React from 'react';

const useFetch = () => {
    const [data, setData] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const [status, setStatus] = React.useState(null);

    const request = React.useCallback(async (url, options) => {
        let response;
        let json;

        try {
            setError(null);
            setLoading(true);
            response = await fetch(url, options);
            if (!response.ok) {
                setLoading(false);
                throw new Error('Não foi possível efetuar solicitação.');
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                json = await response.json();
            } else {
                json = null;
            }
        } catch (err) {
            console.error('Erro na requisição:', err.message);
            json = null;
            setError(err.message);
        } finally {
            setData(json);
            setLoading(false);
            setStatus(response.status);
            return {response, json};
        }
    }, []);

    return {status, data, error, loading, request};
};

export default useFetch;
