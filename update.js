const articlesURL = `http://localhost:8055/items/articles`;

// function to get articles
const getArticles = async () => {
    const res = await fetch(articlesURL);
    const data = await res.json();
    return data.data;
}

const translationsURL = `http://localhost:8055/items/articles_translations`;


//function to get current translations in directus
const getTranslations = async () => {
    const res = await fetch(translationsURL);
    const data = await res.json();
    return data.data;
}


const createTranslations = async () => {
    let articles = await getArticles();
    let currentTranslations = await getTranslations();

    //console.log('articles', articles);
    // console.log('currentTranslations', currentTranslations);

    let languagesToAdd = ['en-US', 'de-DE', 'fr-FR', 'ru-RU', 'it-IT', 'pt-BR'];



    articles.map(article => {
        let allCurrentArticleLanguages = currentTranslations.filter(translation => article.translations.includes(translation.id));
        let allCurrentArticleLanguageIds = allCurrentArticleLanguages.map(language => language.id);

        allCurrentArticleLanguages = allCurrentArticleLanguages.map(language => language.languages_id);
        

        const languagesToCreate = languagesToAdd.filter(lang => !allCurrentArticleLanguages.includes(lang));
        const languagesToUpdate = languagesToAdd.filter(lang => allCurrentArticleLanguages.includes(lang));



        // console.log(' allCurrentArticleLanguages',  allCurrentArticleLanguages);
        // console.log(' allCurrentArticleLanguageIds',  allCurrentArticleLanguageIds);
        // console.log('languagesToCreate', languagesToCreate);
        // console.log('languagesToUpdate', languagesToUpdate);


        languagesToUpdate.forEach(async (lang,index) => {
            console.log(allCurrentArticleLanguageIds[index], lang)

                const res = await fetch(`http://localhost:8055/items/articles_translations/${allCurrentArticleLanguageIds[index]}`, {
                    method: 'PATCH',
                    body: JSON.stringify({
                        languages_id: lang,
                        name: "patched name",
                        description: "new description from patch"
                    }),
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8',
                    },
                })

                const data = await res.json();
                //console.log("PATCH response", data)
        
        })

        languagesToCreate.forEach(async lang => {
            const res = await fetch(translationsURL, {
                method: 'POST',
                body: JSON.stringify([{
                    articles_id: article.id,
                    languages_id: lang,
                    name: `test ${lang}`,
                    description: `test new ${lang} description`
                }]),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            });
            const data = await res.json();

            //console.log('data', data);

        })


    })






}


createTranslations();
