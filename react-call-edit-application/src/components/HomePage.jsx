
import PeerPage from './PeerPage';
import CodeEditorPage from './CodeEditorPage';
import VideoPage from './VideoPage';

const HomePage = () =>{
    return (
        <div className="home__page__container">
            <CodeEditorPage/>
            <VideoPage/>
        </div>
    )
}
export default HomePage;