import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Animated, ScrollView } from 'react-native';

class AreaAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            modalAnimation: new Animated.Value(0),
            areaData: this.props.areaData,
            selectedArea: {},
            selectedCity: this.props.areaData[0].areazone,
            selectedStreets: [],
        };
    }

    toggleModal = () => {
        const { showModal, modalAnimation } = this.state;
        if (!showModal) {
            this.setState({ showModal: true });
            Animated.timing(modalAnimation, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(modalAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                this.setState({ showModal: false });
            });
        }
    };

    handleStreetSelection = (selectedStreet) => {
        const { selectedStreets } = this.state;
        let updatedStreets = [...selectedStreets];
        const index = updatedStreets.findIndex((street) => street.street === selectedStreet.street);
        if (index !== -1) {
            updatedStreets.splice(index, 1);
        } else {
            updatedStreets.push(selectedStreet);
        }
        this.setState({ selectedStreets: updatedStreets });
    };

    handleConfirmation() {
        this.props.reception(this.state.selectedStreets)
    }

    render() {
        const { showModal, modalAnimation } = this.state;
        const opacity = modalAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 0.5],
        });
        const translateY = modalAnimation.interpolate({
            inputRange: [0, 1],
            outputRange: [300, 0],
        });
        return (
            <View style={styles.container}>
                <TouchableOpacity onPress={this.toggleModal} style={styles.button}>
                    <Text style={styles.buttonText}>点击按钮</Text>
                </TouchableOpacity>

                <Modal visible={showModal} animationType="none" transparent={true}>

                    <View style={styles.modalContainer}>
                        <Animated.View style={[styles.modalBackground, { opacity }]} />
                        <Animated.View style={[styles.modalContent, { transform: [{ translateY }] }]}>

                            {/* 取消按钮 */}
                            <TouchableOpacity style={styles.cancelButton} onPress={() => { this.toggleModal() }}>
                                <Text style={styles.buttonTexts}>关闭</Text>
                            </TouchableOpacity>

                            {/* 确定按钮 */}
                            <TouchableOpacity style={styles.confirmButton} onPress={() => { this.handleConfirmation() }}>
                                <Text style={styles.buttonTexts}>确定</Text>
                            </TouchableOpacity>

                            {/* 市选择 */}
                            <View style={styles.flex1}>
                                {this.state.areaData.map((item) => (
                                    <TouchableOpacity
                                        key={item.areazone}
                                        style={[
                                            styles.modalBtn,
                                            this.state.selectedCity === item.areazone && { backgroundColor: 'gray' },
                                        ]}
                                        onPress={() => {
                                            this.setState({ selectedCity: item.areazone }); // 更新选中的城市
                                        }}
                                    >
                                        <Text style={[styles.fontSize13, this.state.selectedCity === item.areazone && { color: 'white' }]}>
                                            {item.areazone}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            {/* 区选择 */}
                            <ScrollView style={[styles.flex1, { marginLeft: 10, marginRight: 10, height: 300 }]}>
                                {this.state.selectedCity &&
                                    this.state.areaData.map((item) => {
                                        if (item.areazone === this.state.selectedCity && item.children) {
                                            return item.children.map((child) => (
                                                <TouchableOpacity
                                                    key={child.areazone}
                                                    style={[
                                                        styles.modalBtn,
                                                        this.state.selectedArea && this.state.selectedArea.areazone === child.areazone && {
                                                            backgroundColor: 'gray',
                                                        }, // 如果当前区为选中状态，则改变样式
                                                    ]}
                                                    onPress={() => {
                                                        this.setState({ selectedArea: child }); // 更新选中的区
                                                    }}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.fontSize13,
                                                            this.state.selectedArea && this.state.selectedArea.areazone === child.areazone && {
                                                                color: 'white',
                                                            },
                                                        ]}
                                                    >
                                                        {child.areazone}
                                                    </Text>
                                                </TouchableOpacity>
                                            ));
                                        }
                                    })}
                            </ScrollView>

                            {/* 街道选择 */}
                            <ScrollView style={[styles.flex1, { height: 300 }]}>
                                {this.state.selectedArea &&
                                    this.state.selectedArea.children &&
                                    this.state.selectedArea.children.map((street) => (
                                        <TouchableOpacity
                                            key={street.street}
                                            style={[
                                                styles.modalBtn,
                                                this.state.selectedStreets.find((s) => s.street === street.street) && { backgroundColor: 'gray' },
                                            ]}
                                            onPress={() => {
                                                this.handleStreetSelection(street); // 处理街道选择
                                            }}
                                        >
                                            <Text
                                                style={[
                                                    styles.fontSize13,
                                                    this.state.selectedStreets.find((s) => s.street === street.street) && { color: 'white' },
                                                ]}
                                            >
                                                {street.areazone}
                                            </Text>
                                        </TouchableOpacity>

                                    ))}
                            </ScrollView>
                        </Animated.View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cancelButton: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#dcdfe6',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4
    },
    confirmButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: '#409eff',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 4
    },
    buttonTexts: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    flex1: {
        flex: 1
    },
    fontSize13: {
        fontSize: 13
    },
    modalBtn: {
        padding: 10,
        marginBottom: 1,
        borderRadius: 4
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    modalBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'black',
    },
    modalContent: {
        backgroundColor: 'white',
        paddingTop: 50,
        paddingLeft: 10,
        paddingRight: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        flexDirection: 'row'
    },
    closeButton: {
        alignItems: 'center',
        padding: 10,
    },
    closeButtonText: {
        color: 'black',
        fontSize: 16,
    },
});

export default AreaAddress;
