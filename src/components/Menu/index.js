import { Drawer, Button, Space } from 'antd';

const Menu = () => {
    let state = { visible: false, placement: 'top' };

    const showDrawer = () => {
        state.visible = true;
    };

    const onClose = () => {
        state.visible = false;
    };

    const { placement, visible } = state;

    return (
        <>
            <Space>
                <Button type="primary" onClick={showDrawer()}>
                    Open
                </Button>
            </Space>
            <Drawer
                title="Basic Drawer"
                placement={placement}
                closable={false}
                onClose={onClose()}
                visible={visible}
                key={placement}
            >
                <p>Some contents...</p>
                <p>Some contents...</p>
                <p>Some contents...</p>
            </Drawer>
        </>
    );
}

export default Menu;