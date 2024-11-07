import { useEffect, useState } from "react";
import "./styles.css"
import { Link } from "react-router-dom";

import 'aos/dist/aos.css';
import AOS from 'aos';
import 'animate.css';


interface Movies{
  title : string,
  id: number,
  overiew : string,
  poster_path: string
}


export function Home(){
    const [TopMovies, setTopMovies] = useState<Movies[]>([]);

    const [moviesSearch, setMoviesSearch] = useState<Movies[]>([]);

    const [movies, setMovies] = useState<Movies[]>([]); 
  
    const [query, setQuery] = useState('');

    const [midiaType, setMidiaType] = useState("movie");


    useEffect(() => {

      let midia = "https://api.themoviedb.org/3/movie/top_rated?language=pt-BR&page=1"
      if (midiaType === "movie") {
        midia = "https://api.themoviedb.org/3/movie/top_rated?language=pt-BR&page=1";
      } else if (midiaType === "tv") {
        midia = "https://api.themoviedb.org/3/discover/tv?language=pt-BR&page=1&with_genres=16&sort_by=vote_average.desc&vote_count.gte=1000";
      } else {
        throw new Error("Tipo de mídia inválido: " + midiaType);
      }

      const getTop =()=>{
        
        fetch(midia, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,  // Substitua `YOUR_ACCESS_TOKEN` pelo seu token
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error("Erro na requisição: " + response.status);
            }
            return response.json();
          })
          .then(data => {
            const top5Movies = data.results.slice(0, 5);
            setTopMovies(top5Movies)
          })
          .catch(error => console.error("Erro:", error));

        }
        getTop();

      }, [midiaType]);

      useEffect(() => {

        let midia = `https://api.themoviedb.org/3/search/movie?language=pt-BR&query=${query}`
        if (midiaType === "movie") {
          midia = `https://api.themoviedb.org/3/search/movie?language=pt-BR&query=${query}`;
        } else if (midiaType === "tv") {
          midia = `https://api.themoviedb.org/3/search/tv?language=pt-BR&query=${query}`;
        } else {
          throw new Error("Tipo de mídia inválido: " + midiaType);
        }

        const fetchMovies = async () => {
          if (query.length === 0) {
            setMoviesSearch([]);
            return;
          }
    
          try {
            const response = await fetch(midia, {
                headers: {
                  Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
                },
              });            
              if (!response.ok) {
              throw new Error("Erro na requisição: " + response.status);
            }
            const data = await response.json();
            setMoviesSearch(data.results);
          } catch (err) {
            console.log(err); 
          }
        };
        fetchMovies();
      }, [query]);

      
      
      useEffect(() => {
        let midia = "https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1"
        if (midiaType === "movie") {
          midia = "https://api.themoviedb.org/3/movie/popular?language=pt-BR&page=1";
        } else if (midiaType === "tv") {
          midia = "https://api.themoviedb.org/3/discover/tv?language=pt-BR&page=1&with_genres=16";
        } else {
          throw new Error("Tipo de mídia inválido: " + midiaType);
        }
        
      const getMidia = () => {
       fetch(midia, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,  // Substitua `YOUR_ACCESS_TOKEN` pelo seu token
          }
        })
          .then(response => {
            if (!response.ok) {
              throw new Error("Erro na requisição: " + response.status);
            }
            return response.json();
          })
          .then(data => {
            const Movies = data.results;
            setMovies(Movies)
          })
          .catch(error => console.error("Erro:", error));
      }

      getMidia();

      }, [midiaType]);

      useEffect(() => {
        AOS.init({ duration: 1000, once: false, startEvent: "DOMContentLoaded" });
      }, []);


  const [fade, setFade ] = useState("fade-right")
  useEffect(() => {
   
    if(midiaType === "movie"){
      setFade("fade-right")
    }else{
      setFade("fade-left")
    }

  },[midiaType]);


    return(
        <div>
            <h1 style={{fontSize:"90px", fontWeight:"500"}}>NerdShow</h1>

            {midiaType === "movie" ? (
              <div className="TopMovies animate__animated animate__bounceInLeft">
                <h2>Top Filmes</h2>
             {TopMovies.map(movie=>(
              <Link to={`${midiaType}/${movie.id}`}>
                <div key={movie.id} >
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                </div>
                </Link>
            ))}   </div>    
          ):( 
            <div className="TopAnimaçoes animate__animated animate__bounceInRight">
              <h2>Top Animações</h2>
            {TopMovies.map(movie=>(
          <Link to={`${midiaType}/${movie.id}`}>
            <div key={movie.id}>
            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
            </div>
          </Link>
            ))}  
            </div>
        )}         
            
          <button
          onClick={e=> setMidiaType("movie")} 
          className="button1"
          style={{background: midiaType === "movie" ? "#F00000" : "",
                  color: midiaType === "movie" ? "black":""
                }}
          >Filmes</button>

          <button
           className="button2"
           style={{background: midiaType === "tv" ? "#F7BB0E" : "",
            color: midiaType === "tv" ? "black":""
          }}
          onClick={e=> setMidiaType("tv")}
          >Animações</button>

<div className="movies">
            <input type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar filmes..."
                    className="inputSearch"
                    style={{borderColor: midiaType === "movie" ? "#F00000" : "#F7BB0E",}}
                    />
  <div className="MoviesImages">
         {query.length === 0 ?(
             movies.map(movie=>(
              <Link to={`${midiaType}/${movie.id}`} className="animate__animated animate__bounce">
                <div key={movie.id}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                </div>
              </Link>
             ))
         ):(
            moviesSearch.map(movie=>(
              <Link to={`${midiaType}/${movie.id}`} className="animate__animated animate__bounce">
                <div key={movie.id}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                </div>
              </Link>
            ))
        )}
        </div>
        </div>
        </div>
    )
}