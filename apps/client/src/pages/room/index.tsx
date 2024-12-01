import { useEffect } from "react";

import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import useAxios from "@/hooks/use-axios";
import { getScene } from "@/utils/getScene";
const Room = () => {
  const {roomCode} = useParams()
  const api = useAxios()
  const {data,error,isError,isLoading} = useQuery({
    queryKey:["room"],
    queryFn:async()=>{
      return (await api.get("/room/code/"+roomCode)).data
    }
  })
  console.log(error)
  console.log(data)
  useEffect(() => {
    if(data && data.data){
       initPhaser(data.data.mapId);
    }
    return () => {};
  }, [data]);
  async function initPhaser(mapId:string) {

    const Phaser = await import("phaser");
    new Phaser.Game({
      type: Phaser.AUTO,
      title: "Test",
      parent: "game-content",
      width: 750,
      height: 500,
      pixelArt: true,
      scale: {
        zoom: 1,
      },
      scene: getScene(mapId) ,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 0, x: 0 },
          debug: true,
        },
      },
      backgroundColor: "#000",
    });
  }
  if(isLoading){
    return <div>
      <h1>Loading room data</h1>
    </div>
  }
  if(isError){ return <div>
    
      <h1>{
      //@ts-ignore
      error.response.data.message || error.message}</h1>
    </div>
  }
  console.log(data)
  return (
    <div>
      {
        data && data.data && <h1>
          {data.data.roomName}
        </h1>
      }

      <div id="game-content" key={"game-content"}></div>
      <div>

      </div>
    </div>
  )
}

export default Room