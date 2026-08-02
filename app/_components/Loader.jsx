import { ClipLoader } from 'react-spinners'

export default function Loader({ isFullHeight = false }) {
  return (
    <div
      className={`flex ${
        isFullHeight ? 'h-screen' : ''
      } justify-center items-center`}
    >
      <ClipLoader size={60} color="#4A90E2" />
    </div>
  )
}
