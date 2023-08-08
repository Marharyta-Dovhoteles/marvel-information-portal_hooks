import { useEffect, useState } from 'react';
import Spinner from '../spinner/Spinner';
import ErrorMessage from '../errorMessage/ErrorMessage';
import MarvelService from '../../services/MarvelService';

import './randomChar.scss';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {

    const [char, setChar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false)

    const marvelService = new MarvelService();

    useEffect(() => {
        updateChar();
       const timerID = setInterval(updateChar, 3000);
       
       return () => {
        clearInterval(timerID);
       }
    }, [])

    const onCharloaded = (char) => {
        setChar(char);
        setLoading(loading => false);
    }

    const onCharLoading = () => {
        setLoading(loading => true);
    }

    const onError = () => {
        setLoading(loading => false);
        setError(error => true)
    }

    const updateChar = () => {
        const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
        onCharLoading();
        marvelService
            .getCharacter(id)
            .then(onCharloaded)
            .catch(onError)
    }

        const errorMessage = error ? <ErrorMessage/> : null;
        const spinner = loading ? <Spinner/> : null;
        const content = !(loading || error) ? <View char={char}/> : null;

        return (
            <div className="randomchar">
                {errorMessage}
                {spinner}
                {content}
                <div className="randomchar__static">
                    <p className="randomchar__title">
                        Random character for today!<br/>
                        Do you want to get to know him better?
                    </p>
                    <p className="randomchar__title">
                        Or choose another one
                    </p>
                    <button className="button button__main" onClick={updateChar}>
                        <div className="inner">try it</div>
                    </button>
                    <img src={mjolnir} alt="mjolnir" className="randomchar__decoration"/>
                </div>
            </div>
        )
    
}

const View = ({char}) => {
    const {name, description, thumbnail, homepage, wiki} = char;

    let imgSize = {objectFit: 'cover'};
    if (thumbnail === 'http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg') {
        imgSize = {objectFit: 'contain'};
    }

    const cutDescription = description => {
        if (description.length > 150) {
            return description.slice(0, 150) + '...'
        }
        return description
    }

    return (
                <div className="randomchar__block">
                    <img src={thumbnail} alt="Random character" className="randomchar__img" style={imgSize}/>
                    <div className="randomchar__info">
                        <p className="randomchar__name">{name}</p>
                        {description ? (
                            <p className="randomchar__descr">{cutDescription(description)}</p>
                        ) : (
                            <p>Oops! description not found</p>
                        )} 
                       
                        <div className="randomchar__btns">
                            <a href={homepage} className="button button__main">
                                <div className="inner">homepage</div>
                            </a>
                            <a href={wiki} className="button button__secondary">
                                <div className="inner">Wiki</div>
                            </a>
                        </div>
                    </div>
                </div>
    )
}

export default RandomChar;