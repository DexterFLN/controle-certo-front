import React from 'react';

const Head = (props) => {
  React.useEffect(() => {
    document.title = props.title + ' | Controle certo';
    const metaDescription = document.querySelector("meta[name='description']");
    if (metaDescription) {
      metaDescription.setAttribute('content', props.description || '');
    } else {
      console.warn(
        'Element <meta name="description"> não encontrado no documento.',
      );
    }
  }, [props]);
  return <></>;
};

export default Head;
