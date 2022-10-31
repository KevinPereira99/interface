import { Drawer, Box, Typography, Input, Button } from '@material-ui/core'
import { useState } from 'react'

export const BookmarkDrawer = ({ isDrawerOpen, handleOnClose, time_start, time_end, setTimeEnd, setTimeStart, addBookmark, description, setDescription }) => {

    const handle_start_input = (e) => {
        setTimeStart(e.target.value)
    }
    const handle_end_input = (e) => {
        setTimeEnd(e.target.value)
    }

    const handle_description = (e) => {
        setDescription(e.target.value)
    }
    return (
        <>
            <Drawer anchor='right'
                open={isDrawerOpen}
                onClose={handleOnClose}
            >
                <Box width={300}>
                    <Typography> BookMark drawer</Typography>
                    <Box>
                        <div style={{ flex: 1, flexDirection: 'row' }}>
                            <Typography> Time start: </Typography>
                            <Input value={time_start} onChange={handle_start_input}></Input>
                        </div>
                        <div style={{ flex: 1, flexDirection: 'row' }}>
                            <Typography > Time end: </Typography>
                            <Input onChange={handle_end_input}></Input>
                        </div>
                        <div style={{ flex: 1, flexDirection: 'row' }}>
                            <Typography> Description: </Typography>
                            <Input onChange={handle_description}></Input>
                        </div>

                    </Box>

                    
                </Box>
                <Box>
                    <div className="App">
                        Select bodyPart
                        <div className="bodyPart1">
                            Upper Body
                            <div className="bodyPart2">
                                <input type="checkbox" id="Right Arm" name="Right Arm" value="Paneer" />Right Arm
                                <input type="checkbox" id="Left Arm" name="Left Arm" value="Paneer" />Left Arm
                            </div>
                            <div className="bodyPart1">
                                Lower Body
                                <div className="bodyPart2">
                                    <input type="checkbox" id="Right Leg" name="Right Leg" value="Paneer" />Right Leg
                                    <input type="checkbox" id="Left Leg" name="Left Leg" value="Paneer" />Left Leg
                                </div>
                            </div>
                        </div>
                    </div>
                </Box>
                <Button onClick={() => addBookmark(time_start, time_end, description)}> Add Bookmark</Button>

            </Drawer>
        </>
    )
}