import { Link, useParams } from "react-router-dom";
import "./styles.css"
import { useEffect, useState } from "react";

import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import { Box } from '@mui/material';
import Modal from '@mui/material/Modal';
import { CircularProgress } from "@mui/material";


import { toast } from "react-toastify";



interface Midia{
    title : string,
    id: number,
    overview: string,
    poster_path: string,
    vote_average: number,
    release_date:string,
    mediaType: string,
    favId:number

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
   mediaId:number,
   mediaType:string
 }


export function User(){
    const { id } = useParams();


    const [user, setUser] = useState<User>();
    const [userImage, setUserImage] = useState<UserImage>();
    const [favs, setFavs]= useState<fav[]>([]);
    const [comments, setComments]= useState<Comment[]>([]);
    const [midia, setMidia] = useState<Midia[]>([]);
    
    const [file, setFile] = useState<File | null>(null);

    const [atlCom, setAtlCom]=useState(0);
    const [atlfavs, setAtlfavs]= useState(0);
    const [atlImg, setAtlImg]=useState(0);

    const [userId, setUserId] = useState('');

    //modal
    const [openM, setOpenM] = useState(false);
    const handleOpenM = () => setOpenM(true);
    const handleCloseM = () => setOpenM(false);


   // setar conexão
   useEffect(() =>{
    const IdUser = localStorage.getItem('userId')

    if(IdUser){
     setUserId(IdUser);
   }else{
     setUserId("");
       }

    },[])


    //pegar usuario e foto
    useEffect(() => {

        const getUser = async () => {
            if (id) {
                const ApiUrlUser = `https://localhost:7245/NerdUser/${id}`

                await fetch(ApiUrlUser).then(response => response.json())
                    .then(data => {
                        setUser(data);
                    })
                const ApiUrlUserImage = `https://localhost:7245/NerdImage/${id}`
                await fetch(ApiUrlUserImage).then(response => response.json())
                    .then(data => {
                        setUserImage(data);
                    })
            }
        }
        getUser();
    }, [id, atlImg])

    //pegar comentarios

    useEffect(() => {
        const getComments = async()=>{
            const ApiComments= `https://localhost:7245/NerdComment/${id}`
            await fetch(ApiComments).then( response => response.json())
            .then( data =>{
              setComments(data);
              console.log("comentarios",data); 
            })
        }
        getComments();
    },[atlCom, atlImg ]);

    //ver comentario 
const [visibleCommentId, setVisibleCommentId] = useState(0);

const toggleCommentVisibility = (id : number) => {
  setVisibleCommentId(prevId => (prevId === id ? 0 : id));
};

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

  // favoritos
  useEffect(() => {
    if(id){
    const getFav = async()=>{
       const ApiFav = `https://localhost:7245/NerdFavorite/${id}`
       await fetch(ApiFav).then( response => response.json())
       .then( data =>{
        setFavs(data);
       })
    }
    getFav();
  }
  },[id, atlfavs]);

//adicionar aos favoritos

const AddFav = async(mediaId : number)=>{
    if(id === ""){
      toast.warning("Porfavor se conect");
      return;
    }
    try{
    const ApiFav = `https://localhost:7245/NerdFavorite`
    const data = {
      UserId: id,
      MediaId: mediaId,
      MediaType: "movie"
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
        toast.error("erro ao remover dos favoritos")
        return;
      }
    
      toast.success("Removido dos favoritos");
      setAtlfavs(atlfavs + 1)
  
    }catch(err){
      toast.error("Erro ao retirar dos favoritos")
      console.log(err)
    }
  }

//pegar os favoritos do usuario
  useEffect(() => {
    const getMidias = async () => {
      try {
        const midiasPromises = favs.map(async (fav) => {
          const endpoint = `https://api.themoviedb.org/3/${fav.mediaType}/${fav.mediaId}?language=pt-BR`;
          const response = await fetch(endpoint, {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_ACCESS_TOKEN}`,
            },
          });
          if (!response.ok) throw new Error("Erro na requisição: " + response.status);
          const mediaData = await response.json();

          return {
            ...mediaData,  
            mediaType: fav.mediaType,
            favId: fav.id
          };
        });
  
        
        const midiasData = await Promise.all(midiasPromises);
        setMidia(midiasData);
        
      } catch (error) {
        console.error("Erro ao buscar mídia:", error);
      }
    };
  
    getMidias();
  }, [favs]);


//trocar foto

const [loading, setLoading] = useState(false);


  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);
  };

const TrocarFoto = async ()=>{
  if (file === null){
    toast.warning("Selecione uma imagem");
    return;
  }
  try{
    setLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend =()=>{
      const base64string = reader.result as string;

      const ImageUserUrl = `https://localhost:7245/NerdImage/${id}`;

      const dados={
        Image: base64string
      }

      fetch(ImageUserUrl,{
        method:"PUT",
        headers:{
          'Content-Type': 'application/json'
        },
        body:JSON.stringify(dados)
      }).then(async response => {
        if (!response.ok) throw new Error("Erro ao enviar a imagem.");
        const text = await response.text();
        const resultado = text ? JSON.parse(text) : {}; // Captura o resultado
        return resultado;
      })
      .then(resultado => {
        //quando alterar a imagem tbm alterar a imagens dos comentarios
        if(comments.length > 0){
          const dados = [{
            "op":"replace",
            "path":"/UserImage",
            "value": resultado.image
          }]
          comments.map(comment=>{
            console.log("id do comentario",comment.id, resultado.image);
            const comentUrl = `https://localhost:7245/NerdComment/${comment.id}`;
            fetch(comentUrl,{
              method:"PATCH",
              headers:{
                'Content-Type': 'application/json'
              },
              body:JSON.stringify(dados)
            })

          })
          toast.success("Imagem enviada com sucesso");
        }else{
          toast.success("Imagem enviada com sucesso");
        }
      })
      .catch(error =>toast.error("Erro ao enviar a imagem"))
      .finally(() =>( 
        setLoading(false),
        setOpenM(false),
        setAtlImg(atlImg + 1)
      ));;
  };
    
  }catch{
    toast.error("Erro ao enviar imagem");
    setLoading(false);
  }
}
  
    return(
        <div className="userContainer">
            <div className="User">
            { user?.userId === userId ?(
              <div>
              <EditIcon className="editIconUser" onClick={handleOpenM}/>
              <img src={userImage?.image}/>
              </div>):
            (<img src={userImage?.image}/>)}
            <h2>{user?.name}</h2>
            </div>
 
            <Modal
        open={openM}
        onClose={handleCloseM}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
     <Box className='Modal' >
      {loading ? (<CircularProgress/>):(
        <>
        <h2>Selecione sua nova foto de perfil</h2>
        <br/>
        <input type="file" 
        accept="image/png, image/jpeg"  
        onChange={handleFileChange}
        />
        <br/>
        <button onClick={e=>TrocarFoto()}>Enviar</button>
        </>
      )}
     </Box>
      </Modal>


            <h1>
                Favoritos
            </h1>

            <div className="favoritos">

         {midia.map(fav =>(
            <div className="fav" key={fav.id}>
            { favs.filter(s => s.mediaId === fav.id) ?(
             <>
              <StarIcon className="favIcon" onClick={e=> removeFav(fav.favId)}/>
             </>
            ):(
              <>
              <StarBorderIcon className="favIcon" onClick={ e => AddFav(fav.id)}/>
              </>
            )}
            <Link to={`/${fav.mediaType}/${fav.id}`}>
            <img  className="favImg" src={`https://image.tmdb.org/t/p/w500${fav.poster_path}`}/>
            </Link>
            </div>
            ))}
            </div>
            
            <h2>Comentarios</h2>
            <div className="UserComment">
            {comments.map(com =>(
               <div className="comment" key={com.id}>
              
              { com.userId === userId ? <DeleteIcon className="deleteIcon" onClick={e=> DeleteCom(com.id)}/> : <></>}
               <img src={com.userImage}/>
               <h1>{com.userName}</h1>
               <h3>{com.spoiler === true ? <h2>Com spoiler</h2> : <h2>sem spoiler</h2>}</h3>

               <h3 onClick={() => toggleCommentVisibility(com.id)} style={{cursor:"pointer"}}>
               {visibleCommentId === com.id ? 
               <>
               {com.comment} <br/> ver menos...</> : "Ver comentario..."}
               </h3>  
              </div>                
              ))}
            </div>
        </div>
    )
}