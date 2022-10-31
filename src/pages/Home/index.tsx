/* eslint-disable react/jsx-props-no-spreading */
import React, { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import NavBar from '../../components/NavBar';
import SectionVideos from '../../components/SectionVideos';
import FeaturedMovie from '../../components/FeaturedMovie';
import { Drawer, Checkbox, Divider } from 'antd';
import { ChecklistHeader, Container, Loading } from './styles';
import '../../../node_modules/antd/dist/antd.css';
import {video_api} from '../../services/api';

interface VideosProps {
  id: number,
  type: string,
  name: string,
  category: string,
  imageData: any,
  imageName: string,
  views: number
}

interface SectionVideosProps {
  id: number,
  name: string,
  videos: VideosProps[]
}

const Home: React.FC = () => {
  const CheckboxGroup = Checkbox.Group;

  const plainOptions = ['Apple', 'Pear', 'Orange'];
  const defaultCheckedList = ['Apple', 'Orange'];

  const [sectionsVideos, setSectionsVideos] = useState<SectionVideosProps[]>(
    [],
  );
  const [video, setVideo] = useState<VideosProps>({} as VideosProps);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState({ visible: false });
  const [checkedList, setCheckedList] = React.useState(defaultCheckedList);
  const [indeterminate, setIndeterminate] = React.useState(true);
  const [checkAll, setCheckAll] = React.useState(false);

  const onChange = (list: any) => {
    setCheckedList(list);
    setIndeterminate(!!list.length && list.length < plainOptions.length);
    setCheckAll(list.length === plainOptions.length);
  };

  const onCheckAllChange = (e: any) => {
    setCheckedList(e.target.checked ? plainOptions : []);
    setIndeterminate(false);
    setCheckAll(e.target.checked);
  };

  const showDrawer = () => {
    setState({ visible: true });
  };

  const onClose = () => {
    setState({ visible: false });
  };

  useEffect(() => {
    fetch(`${video_api}/best/popular`)
      .then((response) => {
        if (response.status !== 200) {
          console.log(`Looks like there was a problem. Status Code: response.status`);
          return;
        }

        response.json().then((data) => {
          data.imageData = Buffer.from(data.imageData).toString('base64');
          setVideo(data);
        });
      })
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });

    fetch(video_api)
      .then((response) => {
        if (response.status !== 200) {
          console.log(`Looks like there was a problem. Status Code: response.status`);
          return;
        }

        response.json().then((data) => {
          const categories: string[] = [];
          const videos: SectionVideosProps[] = [];
          let sectionId: number = 0;

          data.forEach((element: VideosProps) => {
            element.imageData = Buffer.from(element.imageData).toString('base64');
            if (categories.indexOf(element.category) === -1) {
              categories.push(element.category);
              videos.push({
                id: sectionId,
                name: element.category,
                videos: [element]
              });
              sectionId++;
            } else {
              videos.forEach((video: SectionVideosProps) => {
                if (video.name === element.category) {
                  video.videos.push(element);
                }
              });
            }
          });

          setSectionsVideos(videos);
          setTimeout(() => setLoading(false), 800);
        });
      })
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });

  }, [sectionsVideos, state]);

  const { visible } = state;
  const labels = document.getElementById('labels');
  if (labels) {
    labels.addEventListener('click', () => {
      showDrawer();
    });
  }

  return (
    <Container>
      <NavBar />
      {loading ? (
        <Loading>
          <div>
            <span />
            <strong>B</strong>
          </div>
        </Loading>
      ) : (
        <>
          <FeaturedMovie video={video} />
          <div style={{ marginTop: -200 }}>
            {sectionsVideos.map(sectionVideo => (
              <SectionVideos {...sectionVideo} key={sectionVideo.id} />
            ))}
          </div>
          <Drawer
            title="Basic Drawer"
            placement="top"
            closable={false}
            onClose={e => onClose()}
            visible={visible}
            key={"top"}
          >
            <ChecklistHeader>Violence</ChecklistHeader>
            <Checkbox indeterminate={indeterminate} onChange={onCheckAllChange} checked={checkAll}>
              Check all
            </Checkbox>
            <Divider />
            <CheckboxGroup options={plainOptions} value={checkedList} onChange={onChange} />
          </Drawer>
        </>
      )}
    </Container>
  );
};

export default Home;
