import React, { useEffect, useState } from 'react';
import './styles.css';
import {video_api} from '../../services/api';
import BG from '../../assets/bg.svg';
import Video from '../../assets/video.svg'
import { Upload, message, Drawer, Checkbox } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

const Home = () => {
    const CheckboxGroup = Checkbox.Group;

    const plainOptions = ['Apple', 'Pear', 'Orange'];
    const defaultCheckedList = ['Apple', 'Orange'];

    const { Dragger } = Upload;

    const [visible, setVisible] = useState(false);
    const [placement, setPlacement] = useState('top');
    const [files, setFiles] = useState();

    const showDrawer = () => {
        setVisible(true);
    };

    const onClose = () => {
        setVisible(false);
    };

    const onChange = e => {
        setPlacement(e.target.value);
    };

    const props = {
        accept: ".jpeg,.jpg,.png,.doc,.mp4",
        multiple: true,
        onChange: (info) => {
            setFiles(info);
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };

    const inputs = document.querySelectorAll(".input");

    function addcl() {
        let parent = this.parentNode.parentNode;
        parent.classList.add("focus");
    }

    function remcl() {
        let parent = this.parentNode.parentNode;
        if (this.value == "") {
            parent.classList.remove("focus");
        }
    }

    inputs.forEach(input => {
        input.addEventListener("focus", addcl);
        input.addEventListener("blur", remcl);
    });

    const uploadFiles = () => {
        let formData = new FormData();
        const categoryLabel = document.getElementById('categoryLabel');
        console.log(files.fileList[0].originFileObj)
        formData.append('multi-files', files.fileList[0].originFileObj, files.fileList[0].name);
        formData.append('multi-files', files.fileList[1].originFileObj, files.fileList[1].name);
        formData.append('category', categoryLabel.value);
        for (var pair of formData.entries()) {
            console.log(pair[0] + ', ' + pair[1]);
        }

        fetch(video_api, {
            method: 'POST',
            body: formData,
        });




    }

    return (
        <>
            <Drawer
                title="Basic Drawer"
                placement={placement}
                closable={false}
                onClose={onClose}
                visible={visible}
                key={placement}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
            <div className="container">
                <div className="img">
                    <img src={BG}></img>
                </div>
                <div className="login-content">
                    <form>
                        <img src={Video}></img>
                        <div className="input-div one">
                            <div className="i">
                                <i className="fas fa-camera-retro"></i>
                            </div>
                            <div className="div">
                                <h5>Video and Thumbnail</h5>
                            </div>
                        </div>
                        <Dragger {...props}>
                            <p className="ant-upload-drag-icon">
                                <InboxOutlined />
                            </p>
                            <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        </Dragger>
                        <p style={{ visible: 'hidden' }}></p>
                        <div className="input-div one">
                            <div className="i">
                                <i className="fas fa-clipboard-list"></i>
                            </div>
                            <div className="div">
                                <h5>Category</h5>
                                <input type="text" className="input" id="categoryLabel"></input>
                            </div>
                        </div>
                        <input type="submit" className="btn" value="Upload" onClick={(e) => {
                            e.preventDefault();
                            uploadFiles();
                        }}></input>
                        <button className="btn" value="Back" onClick={(e) => {
                            e.preventDefault();
                            window.location.href = 'http://localhost:3000';
                        }}>Back</button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default Home;