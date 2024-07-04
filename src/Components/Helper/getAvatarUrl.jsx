
export const getAvatarDetails = (level) => {
    const normalizedLevel = level == null ? 0 : level;
    const avatars = {
        0: 'src/Assets/IconsHeader/Avatar/lvl0.jpeg',
        1: 'src/Assets/IconsHeader/Avatar/lvl1.jpeg',
        2: 'src/Assets/IconsHeader/Avatar/lvl2.jpeg',
        3: 'src/Assets/IconsHeader/Avatar/lvl3.jpeg',
        4: 'src/Assets/IconsHeader/Avatar/lvl4.jpeg',
        5: 'src/Assets/IconsHeader/Avatar/lvl5.jpeg',
        6: 'src/Assets/IconsHeader/Avatar/lvl6.jpeg',
    };

    const messages = {
        0: "Vamos começar sua jornada de economia! A cada passo você chegará mais perto de suas metas.",
        1: "Parabéns por seus esforços! Continue economizando e logo você atingirá a próxima meta.",
        2: "Incrível! Você está mostrando grande disciplina financeira. Continue assim e verá resultados ainda maiores.",
        3: "Fantástico! Sua dedicação está valendo a pena. Continue economizando e colha os frutos.",
        4: "Você está quase lá! Mantenha o foco e continue atingindo suas metas financeiras.",
        5: "Você é uma inspiração! Sua habilidade de economizar está te levando longe. Continue firme e colha os frutos do seu trabalho!",
        6: "Impressionante! Sua disciplina financeira é exemplar. Continue assim e atinja novos patamares."
    };

    return {
        avatarUrl: avatars[normalizedLevel] || avatars[0],
        message: messages[normalizedLevel] || messages[0]
    };
};
