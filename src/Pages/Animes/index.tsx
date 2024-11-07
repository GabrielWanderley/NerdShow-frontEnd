import { useParams } from "react-router-dom";
import "./styles.css"
import { useEffect, useState } from "react";

import { toast } from "react-toastify";

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import CreateIcon from '@mui/icons-material/Create';

interface Midia{
    title : string,
    id: number,
    overview: string,
    poster_path: string,
    vote_average: number,
    first_air_date:string

  }
  
interface User{
  name: string,
  userId: string,
  email: string
}

interface Comment{

  id:number,
  userId:string,
  comment: string,
  mediaId: number,
  spoiler: boolean,
  userName : string,
  userImage: string
}

interface UserImage{
   UserId:string,
   image:string
}

interface fav{
  id:number,
  userId:string,
  mediaId:number
}


export function Animes(){

    const { id } = useParams();

    const [conect, setConect] = useState(false);
    const [userId, setUserId] = useState('');

    const [user, setUser] = useState<User>();
    const [userImage, setUserImage] = useState<UserImage>();

    
    
    const [comments, setComments]= useState<Comment[]>([]);
    const [favs, setFavs]= useState<fav[]>([]);

    const [atlfavs, setAtlfavs]= useState(0);
    const [atlCom, setAtlCom]=useState(0);

  //midia
    const [midia, setMidia] = useState<Midia>();

    useEffect(() => {
        const getMidia = async () => {
            const response = await fetch(`https://api.themoviedb.org/3/tv/${id}?language=pt-BR`, {
                headers: {
                  Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,  // Substitua `YOUR_ACCESS_TOKEN` pelo seu token
                }
              })
                  if (!response.ok) {
                    throw new Error("Erro na requisição: " + response.status);
                  }               
                  const anime = await response.json();
                  console.log("SDHJAFJK",anime);
                 setMidia(anime);
 
            }
            getMidia();
      },[id]);

   // setar conexão
   useEffect(() =>{
    const conected = localStorage.getItem('conect')
    const IdUser = localStorage.getItem('userId')

    if(conected && conected === 'true'){
    setConect(true);
    }else{
   setConect(false);
    }

    if(IdUser){
     setUserId(IdUser);
   }else{
     setUserId("");
       }

    },[])

      //pegar usuario 
      useEffect(()=>{

        const getUser = async () => {
        if(userId){
        const ApiUrlUser = `https://localhost:7245/NerdUser/${userId}`

        await fetch(ApiUrlUser).then( response => response.json())
        .then( data =>{
          setUser(data);
        })
        const ApiUrlUserImage = `https://localhost:7245/NerdImage/${userId}`
        await fetch(ApiUrlUserImage).then( response => response.json())
        .then( data =>{
          setUserImage(data);
        })
      }  
      }
      getUser();
      },[userId])


      //fazer comentarios

      const [bollean , setBollean] = useState(true);
      const [selectedValue, setSelectedValue] = useState<string>('');
      const [comentario , setComentario] = useState("")
  
      const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedValue(event.target.value)
        if(selectedValue === "true"){
          setBollean(true);
        }else{
          setBollean(false);
        }
    };
  
      const sendComment = async ()=>{        
        
        if( comentario === "" || userId === "" ) {
            toast.warning("Porfavor preencha todos os dados");
            return;
          }
        try{
          
          if(user && userImage){
  
            const ApiUrlComment = "https://localhost:7245/NerdComment";
            
            const data ={
               UserId: userId,
               Comment: comentario,
               MediaId: id,
               Spoiler: bollean,
               UserName: user.name,
               UserImage: userImage.image
            }
  
            const Comment = await fetch(ApiUrlComment,{
              method : "POST",
              headers:{
                'Content-Type': 'application/Json'
              },
              body: JSON.stringify(data)
            });
  
            if(!Comment.ok){
              toast.error("erro em enviar comentario")
            }
  
            const responseComment = await Comment.json();
  
            console.log("Comentario enviado",responseComment);
            setComentario("");
            toast.success("Comentario enviado")
            const atl = 1 + atlCom ;
            setAtlCom(atl);
    
          }
          
        }catch(err){
          toast.error("Erro ao enviar comentario")
        }
      }

    //Pegar comentarios

useEffect(() => {
  const getComments = async()=>{
      const ApiComments= `https://localhost:7245/NerdComment/${id}/Filme`
      await fetch(ApiComments).then( response => response.json())
      .then( data =>{
        setComments(data);
        console.log("comentarios",data); 
      })
  }
  getComments();
},[atlCom]);


//deletar comentarios

const DeleteCom = async( id : Number)=>{

  try{
    const ApiUrlComment = `https://localhost:7245/NerdComment/${id}`;

    const comm = await fetch(ApiUrlComment,{
      method : "DELETE"
    });

    if(!comm.ok){
      toast.error("erro em deletar comentario")
      return;
    }

    toast.success("Deletado com sucesso")
    const atl = 1 + atlCom ;
    setAtlCom(atl);

  }catch{
    toast.error("falha ao deletar comentario")
  }

}

//ver comentario 
const [visibleCommentId, setVisibleCommentId] = useState(0);

const toggleCommentVisibility = (id : number) => {
  setVisibleCommentId(prevId => (prevId === id ? 0 : id));
};

//pegar favoritos 

useEffect(() => {
  if(userId){
  const getFav = async()=>{
     const ApiFav = `https://localhost:7245/NerdFavorite/${userId}`
     await fetch(ApiFav).then( response => response.json())
     .then( data =>{
      setFavs(data);
       console.log("fav",data); 
     })
  }
  getFav();
}
},[userId, atlfavs]);

const filtredfavs = favs.filter(fav => fav.mediaId === Number(id));


//adicionar aos favoritos

const AddFav = async()=>{
  if(userId === ""){
    toast.warning("Porfavor se conect");
    return;
  }
  try{
  const ApiFav = `https://localhost:7245/NerdFavorite`
  const data = {
    UserId: userId,
    MediaId: id,
    MediaType: "tv"
  }

  const fav = await fetch(ApiFav,{
    method : "POST",
    headers:{
      'Content-Type': 'application/Json'
    },
    body: JSON.stringify(data)
  });

  if(!fav.ok){
    toast.error("erro em enviar comentario")
  }

  toast.success("Adicionado aos favoritos");
  const atl = atlfavs + 1;
  setAtlfavs(atl)

  }catch{
    toast.error("Erro ao adicionar aos favoritos")
  }
}

const removeFav = async (favId : number)=>{
  try{
    
    const ApiFav = `https://localhost:7245/NerdFavorite/${favId}`

    const fav = await fetch(ApiFav,{
      method : "DELETE"
    });

    if(!fav.ok){
      toast.error("erro em enviar aos favoritos")
      return;
    }
  
    toast.success("Removido dos favoritos");
    const atl = atlfavs + 1;
    setAtlfavs(atl)

  }catch(err){
    toast.error("Erro ao retirar dos favoritos")
    console.log(err)
  }
}

    return(
        <div className="MidiaContainer">
            <div className="midiaContent">
            { filtredfavs.length > 0 ?(
             <>
              <StarIcon className="iconfav" onClick={e=> removeFav(filtredfavs[0].id)}/>
             </>
            ):(
              <>
              <StarBorderIcon className="iconfav" onClick={AddFav}/>
              </>
            )}            <h1>{midia?.title}</h1>
            <div className="midiaText">
                <img src={`https://image.tmdb.org/t/p/w500${midia?.poster_path}`}/>
                <div className="textContent">
                <h2><span>Lançamento:</span> {midia?.first_air_date}</h2>
                <h2><span>Sinopse:</span> {midia?.overview}</h2>
                <h2><span>Nota:</span> {midia?.vote_average}</h2>
                </div>
            </div>           
            </div>

            {conect ?(
            <div className="comentContent2">
              <h1>Escreva seu comentario</h1>
              <h2>Tem spoiler ?</h2>
              <label htmlFor="options"></label>
      <select onChange={handleChange} value={selectedValue}>
        <option value="true">Sim</option>
        <option value="false">Não</option>
      </select>
      <br/>
              <textarea 
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              />
              <br/>
       <button onClick={sendComment}>Enviar</button>
            </div>
            ):(<h1>Para comentar faça login</h1>)}

            <div className="midiaComment">
              {comments.map(com =>(
               <div className="comment" key={com.id}>
              
              { com.userId === userId ? <DeleteIcon className="deleteIcon" onClick={e=> DeleteCom(com.id)}/> : <></>}
               <img src={com.userImage}/>
               <h1>{com.userName}</h1>
               <h3>{com.spoiler === true ? <h2>Com spoiler</h2> : <h2>sem spoiler</h2>}</h3>
               <h3 onClick={() => toggleCommentVisibility(com.id)} style={{cursor:"pointer"}}>
               {visibleCommentId === com.id ? <>{com.comment} <br/> ver menos...</> : "Ver comentario..."}
               </h3>
              </div>                
              ))}
            </div>
        </div>
    )
}