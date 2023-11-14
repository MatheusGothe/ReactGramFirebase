
// Animations
import Lottie from 'react-lottie-player'
import loadingAnimation from '../utils/assets/loadingAnimation.json'
const LoadingBall = () => {
  return (
    <div>
      <Lottie className="lottie" loop animationData={loadingAnimation} play />
    </div>
  )
}

export default LoadingBall;
