import React, { useState, useRef, useEffect } from "react";
  import { video_api, bookmark_api } from '../../services/api';
import { useParams } from "react-router-dom";
import { Buffer } from 'buffer';
import { Loading } from '../Home/styles';
import NavBarVideo from '../../components/NavBarVideo';
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import ReactPlayer from "react-player";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Box, Button } from "@material-ui/core"
import Slider from "@material-ui/core/Slider";
import Tooltip from "@material-ui/core/Tooltip";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import screenful from "screenfull";
import Controls from "../../components/VideoControls";
import { bookmark_upload } from "../../services/bookmarkService"

function valuetext(value) {
  return `${value}°C`;
}


const useStyles = makeStyles((theme) => ({
  playerWrapper: {
    width: "100%",
    position: "relative",
  },

  controlsWrapper: {
    visibility: "hidden",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.4)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  topControls: {
    display: "flex",
    justifyContent: "flex-end",
    padding: theme.spacing(2),
  },
  middleControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomWrapper: {
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing(2),
  },

  bottomControls: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },

  button: {
    margin: theme.spacing(1),
  },
  controlIcons: {
    color: "#777",

    fontSize: 50,
    transform: "scale(0.9)",
    "&:hover": {
      color: "#fff",
      transform: "scale(1)",
    },
  },

  bottomIcons: {
    color: "#999",
    "&:hover": {
      color: "#fff",
    },
  },

  volumeSlider: {
    width: 100,
  },
}));

const PrettoSlider = withStyles({
  root: {
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
})(Slider);

function ValueLabelComponent(props) {
  const { children, open, value } = props;

  return (
    <Tooltip open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
    </Tooltip>
  );
}

const format = (seconds) => {
  if (isNaN(seconds)) {
    return `00:00`;
  }
  const date = new Date(seconds * 1000);
  const hh = date.getUTCHours();
  const mm = date.getUTCMinutes();
  const ss = date.getUTCSeconds().toString().padStart(2, "0");
  if (hh) {
    return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
  }
  return `${mm}:${ss}`;
};

let count = 0;

const Video = () => {
  const [video, setVideo] = useState();
  const [loading, setLoading] = useState(true);
  const [description, setDescription] = useState("")
  const [bookmarks, setBookmarks] = useState([]);
  let { id } = useParams();

  const [range_values, setValueRange] = useState([0, 20]);

  const handleRangeValueChange = (event, newValue) => {
    setValueRange(newValue);
  };
  useEffect(() => {
    fetch(`${video_api}/${id}`)
      .then((response) => {
        if (response.status !== 200) {
          console.log(`Looks like there was a problem. Status Code: response.status`);
          return;
        }

        response.json().then((data) => {
          data.data = Buffer.from(data.data).toString('base64');
          setVideo(data);
        });

        setTimeout(() => setLoading(false), 800);
      })
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });
  }, [video]);

  useEffect(() => {
    fetch(`${bookmark_api}/${id}`)
      .then((response) => {
        if (response.status !== 200) {
          console.log(`Looks like there was a problem. Status Code: response.status`);
          return;
        }

        response.json().then((data) => {
          console.log(data)
          console.log(typeof (data))
          setBookmarks(data);
        });


      })
      .catch(function (err) {
        console.log('Fetch Error :-S', err);
      });
  }, []);
  console.log(bookmarks)
  const classes = useStyles();
  const [timeDisplayFormat, setTimeDisplayFormat] = React.useState("normal");

  const [state, setState] = useState({
    pip: false,
    playing: true,
    controls: false,
    light: false,

    muted: true,
    played: 0,
    duration: 0,
    playbackRate: 1.0,
    volume: 1,
    loop: false,
    seeking: false,
  });

  const playerRef = useRef(null);
  const playerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const canvasRef = useRef(null);
  const {
    playing,
    controls,
    light,
    muted,
    loop,
    playbackRate,
    pip,
    played,
    seeking,
    volume,
  } = state;

  const handlePlayPause = () => {
    setState({ ...state, playing: !state.playing });
  };


  const handleProgress = (changeState) => {
    if (count > 3) {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    }
    if (controlsRef.current.style.visibility === "visible") {
      count += 1;
    }
    if (!state.seeking) {
      setState({ ...state, ...changeState });
    }
  };

  const handleSeekChange = (e, newValue) => {
    setState({ ...state, played: parseFloat(newValue / 100) });
  };

  const handleSeekMouseDown = (e) => {
    setState({ ...state, seeking: true });
  };

  const handleSeekMouseUp = (e, newValue) => {
    setState({ ...state, seeking: false });
    playerRef.current.seekTo(newValue / 100, "fraction");
  };

  const handleDuration = (duration) => {
    setState({ ...state, duration });
  };

  const handleVolumeSeekDown = (e, newValue) => {
    setState({ ...state, seeking: false, volume: parseFloat(newValue / 100) });
  };
  const handleVolumeChange = (e, newValue) => {
    setState({
      ...state,
      volume: parseFloat(newValue / 100),
      muted: newValue === 0 ? true : false,
    });
  };

  const toggleFullScreen = () => {
    screenful.toggle(playerContainerRef.current);
  };

  const handleMouseMove = () => {
    controlsRef.current.style.visibility = "visible";
    count = 0;
  };

  const hanldeMouseLeave = () => {
    controlsRef.current.style.visibility = "hidden";
    count = 0;
  };

  const handleDisplayFormat = () => {
    setTimeDisplayFormat(
      timeDisplayFormat === "normal" ? "remaining" : "normal"
    );
  };

  const handlePlaybackRate = (rate) => {
    setState({ ...state, playbackRate: rate });
  };

  const hanldeMute = () => {
    setState({ ...state, muted: !state.muted });
  };



  const addBookmark = async (value, description) => {
    const canvas = canvasRef.current;
    canvas.width = 160;
    canvas.height = 90;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      playerRef.current.getInternalPlayer(),
      0,
      0,
      canvas.width,
      canvas.height
    );
    const dataUri = canvas.toDataURL();
    canvas.width = 0;
    canvas.height = 0;
    const bookmarksCopy = [...bookmarks];
    let new_bookmark = await bookmark_upload(id, value[0], value[1], dataUri)
    bookmarksCopy.push(new_bookmark);
    setBookmarks(bookmarksCopy);
  };

  const currentTime =
    playerRef && playerRef.current
      ? playerRef.current.getCurrentTime()
      : "00:00";

  const duration =
    playerRef && playerRef.current ? playerRef.current.getDuration() : "00:00";
  const elapsedTime =
    timeDisplayFormat === "normal"
      ? format(currentTime)
      : `-${format(duration - currentTime)}`;

  const totalDuration = format(duration);

  return (
    <Box bgcolor="gray" width="100%" height="100%">
      <>
        <NavBarVideo />
        <Toolbar />
        {loading ? (
          <Loading>
            <div>
              <span />
              <strong>B</strong>
            </div>
          </Loading>
        ) : (
          <>

            <Box width="100%" display="flex" justify-content="space-between" marginLeft="1vw">
              <Box width="70vw" marginRight="1vw">
                <div
                  onMouseMove={handleMouseMove}
                  onMouseLeave={hanldeMouseLeave}
                  ref={playerContainerRef}
                  className={classes.playerWrapper}
                >
                  <ReactPlayer
                    ref={playerRef}
                    width="100%"
                    height="100%"
                    url={`data:video/mp4;base64,${video.data}`}
                    pip={pip}
                    playing={playing}
                    controls={false}
                    light={light}
                    loop={loop}
                    playbackRate={playbackRate}
                    volume={volume}
                    muted={muted}
                    onProgress={handleProgress}
                    config={{
                      file: {
                        attributes: {
                          crossorigin: "anonymous",
                        },
                      },
                    }}
                  />

                  <Controls
                    ref={controlsRef}
                    onSeek={handleSeekChange}
                    onSeekMouseDown={handleSeekMouseDown}
                    onSeekMouseUp={handleSeekMouseUp}
                    onDuration={handleDuration}
                    onPlayPause={handlePlayPause}
                    playing={playing}
                    played={played}
                    elapsedTime={elapsedTime}
                    totalDuration={totalDuration}
                    onMute={hanldeMute}
                    muted={muted}
                    onVolumeChange={handleVolumeChange}
                    onVolumeSeekDown={handleVolumeSeekDown}
                    onChangeDispayFormat={handleDisplayFormat}
                    playbackRate={playbackRate}
                    onPlaybackRateChange={handlePlaybackRate}
                    onToggleFullScreen={toggleFullScreen}
                    volume={volume}
                    onBookmark={addBookmark}
                  />
                </div>
                <Box width="70vw" marginRight="1vw">
                  <Slider
                    getAriaLabel={() => 'Temperature range'}
                    min={0}
                    max={parseInt(duration)}
                    value={range_values}
                    onChange={handleRangeValueChange}
                    valueLabelDisplay="auto"
                    getAriaValueText={valuetext}
                  />
                </Box>
              </Box>
              <Box display="flex" justify-content="space-between" >
              <Box width="9vw" marginRight="1px">
                <Box style={{ marginTop: 0 }} marginRight="" >
                  {bookmarks.map((bookmark, index) => (
                    <Grid key={index} item>
                      <Paper
                        onClick={() => {
                          playerRef.current.seekTo(bookmark.time_start);
                          controlsRef.current.style.visibility = "visible";

                          setTimeout(() => {
                            controlsRef.current.style.visibility = "hidden";
                          }, 1000);
                        }}
                        elevation={3}
                      >
                        <Typography variant="body2" align="center">
                          Starts from {bookmark.time_start} until {bookmark.time_end}
                        </Typography>
                        <img crossOrigin="anonymous" src={bookmark.img} />
                        <Typography variant="body2" align="center">
                          {/* {document.getElementById("description").value} */}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Box>
              </Box>
              <canvas ref={canvasRef} />


              <Box>
                <Box bgcolor="gray" height="90%" width="10vw" marginRight="1vw" marginLeft="1px">
                  <div style={{ flex: 1, flexDirection: 'row' }}>
                    <Typography variant="body1" align="center"> Start Time: {range_values[0]} </Typography>
                  </div>
                  <div></div>
                  <div></div>
                  <div style={{ flex: 1, flexDirection: 'row' }}>
                    <Typography variant="body1" align="center"> End Time: {range_values[1]} </Typography>
                  </div>
                  <div></div>
                  <div></div>
                  <Typography></Typography>
                  <div className="bodyPart1" variant="body1" align="center">
                    Passenger ID
                    <div className="bodyPart2">
                      <input type="checkbox" id="Right Arm" name="Right Arm" value="Paneer" />1
                      <div></div>
                      <input type="checkbox" id="Left Arm" name="Left Arm" value="Paneer" />2
                    </div>
                  </div>
                  <div></div>
                  <div className="App" variant="body1" align="center">
                    Select bodyPart
                    <div></div>
                    <div className="bodyPart1" >
                      Upper Body
                      <div className="bodyPart2">
                        <input type="checkbox" id="Right Arm" name="Right Arm" value="Paneer" />Right Arm
                        <div></div>
                        <input type="checkbox" id="Left Arm" name="Left Arm" value="Paneer" />Left Arm
                      </div>
                      <div className="bodyPart1">
                        <div></div>
                        Lower Body
                        <div className="bodyPart2">
                          <input type="checkbox" id="Right Leg" name="Right Leg" value="Paneer" />Right Leg
                          <div></div>
                          <input type="checkbox" id="Left Leg" name="Left Leg" value="Paneer" />Left Leg
                        </div>
                      </div>
                    </div>
                  </div>
                  <div></div>
                  <div style={{ flex: 1, flexDirection: 'row' }}>
                    <Typography variant="body1" align="center"> Description: </Typography>
                    <div></div>
                    <input type="text" style={{ color: 'black', borderRadius: '5px' }} id="description" ></input>
                  </div>
                </Box>
                <Box bgcolor="blue" marginRight="1vw" style={{ borderRadius: '5px' }} display="flex" justify-content="space-between" alignContent="center">
                  <Box width="50%" alignContent="center">
                    <Button align="center" onClick={() => addBookmark(range_values, description)}> Save</Button>
                  </Box>
                  <Box width="10%">
                    <Button > Export</Button>
                  </Box>
                </Box>
              </Box>
            </Box>
            </Box>


          </>




        )}

      </>
    </Box>
  );
}

export default Video;
