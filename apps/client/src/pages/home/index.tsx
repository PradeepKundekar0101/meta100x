import { Button } from "@/components/ui/button"
import { useAppSelector } from "@/store/hooks"

const Home = () => {
  const {user,token} = useAppSelector((state)=>{return state.auth})
  console.log(user)
  console.log(token)
  return (
    <main className=" h-screen">
      <div className=" flex w-full flex-col justify-center items-center h-[50vh] hero">
        <h1 className=" text-4xl text-white font-semibold">Welcome to Meta100x</h1>
        <Button>Explore</Button>
      </div>
    </main>
  )
}

export default Home