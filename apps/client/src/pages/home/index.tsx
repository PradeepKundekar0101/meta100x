import { useAppSelector } from "@/store/hooks"

const Home = () => {
  const {user,token} = useAppSelector((state)=>{return state.auth})
  console.log(user)
  console.log(token)
  return (
    <div>Home</div>
  )
}

export default Home