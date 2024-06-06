import React from 'react';
import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    Font, Image
} from "@react-pdf/renderer";

// Register font
Font.register({
    family: 'Ubuntu',
    fonts: [
        {
            src: 'https://fonts.gstatic.com/s/questrial/v13/QdVUSTchPBm7nuUeVf7EuStkm20oJA.ttf',
        },
        {
            src: 'https://fonts.gstatic.com/s/questrial/v13/QdVUSTchPBm7nuUeVf7EuStkm20oJA.ttf',
            fontWeight: 'bold',
        },
        {
            src: 'https://fonts.gstatic.com/s/questrial/v13/QdVUSTchPBm7nuUeVf7EuStkm20oJA.ttf',
            fontWeight: 'normal',
            fontStyle: 'italic',
        },
    ],
});

const styles = StyleSheet.create({
    page: {
        backgroundColor: "#fff",
        fontFamily: 'Ubuntu',
    },
    section: {
        margin: 10,
        padding: 15,
    },
    heading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: "#131925",
        marginBottom: 5,
    },
    statement: {
        fontSize: 14,
        color: "#131925",
        lineHeight: 1.4,
    },
    divider: {
        width: "100%",
        height: 1,
        backgroundColor: "#999999",
    },
    paragraph: {
        fontSize: 11,
        color: "#212935",
        lineHeight: 1.4,
    },
    columnParent: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 20,
        marginBottom: 15,
    },
    columnStart: {
        flex: 1,
    },
    columnEnd: {
        flex: 1,
        alignItems: "flex-end"
    },
    headTitle: {
        fontSize: 14, fontWeight: 'bold',
        backgroundColor: '#3f5176',
        color: '#fff', width: '100%',
        padding: 7, textAlign: 'center'
    },
    label: {
        fontSize: 10, fontWeight: 'bold', marginBottom: 5
    }
});


// Create Document Component
const Template = ({ currentUser }) => {

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.section}>
                    <View style={[styles.columnParent, { alignItems: 'center' }]}>
                        <View style={styles.columnStart}>
                            <Text style={styles.heading}>Forbes Microfinance Ltd.</Text>
                            <Text style={styles.statement}>WePayGH</Text>
                            <Text style={styles.statement}>Direct Debit Form</Text>
                        </View>
                        <View style={styles.columnEnd}>
                            <View style={{ width: '100px', height: '110px', border: '1px solid lightgrey', }}>
                                <Image source={currentUser?.photo} />
                            </View>
                        </View>
                    </View>

                    {/* Personal */}
                    <Text style={[styles.headTitle, { marginTop: '-10px' }]}>PERSONAL DETAILS</Text>
                    <View style={{ border: '1px solid lightgrey', padding: '15px' }}>
                        <View style={styles.columnParent}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>FULLNAME</Text>
                                <Text style={styles.paragraph}>{currentUser?.fullname}</Text>
                                <View style={styles.divider}></View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>EMAIL</Text>
                                <Text style={styles.paragraph}>{currentUser?.email}</Text>
                                <View style={styles.divider}></View>
                            </View>
                        </View>

                        <View style={styles.columnParent}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>PHONE</Text>
                                <Text style={styles.paragraph}>{currentUser?.phone}</Text>
                                <View style={styles.divider}></View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>GENDER</Text>
                                <Text style={styles.paragraph}>{currentUser?.sex}</Text>
                                <View style={styles.divider}></View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>DATE OF BIRTH</Text>
                                <Text style={styles.paragraph}>{currentUser?.dob}</Text>
                                <View style={styles.divider}></View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>DIGITAL ADDRESS</Text>
                                <Text style={styles.paragraph}>{currentUser?.digital_address}</Text>
                                <View style={styles.divider}></View>
                            </View>
                        </View>

                        <View style={styles.columnParent}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>RESIDENTIAL ADDRESS</Text>
                                <Text style={styles.paragraph}>{currentUser?.address}</Text>
                                <View style={styles.divider}></View>
                            </View>
                        </View>

                        <View style={styles.columnParent}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>OCCUPATION</Text>
                                <Text style={styles.paragraph}>{currentUser?.occupation}</Text>
                                <View style={styles.divider}></View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>COMPANY NAME</Text>
                                <Text style={styles.paragraph}>{currentUser?.company}</Text>
                                <View style={styles.divider}></View>
                            </View>
                        </View>

                        <View style={styles.columnParent}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>COMPANY ADDRESS</Text>
                                <Text style={styles.paragraph}>{currentUser?.companyAddress}</Text>
                                <View style={styles.divider}></View>
                            </View>
                        </View>

                        <View style={styles.columnParent}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>NATIONAL ID</Text>
                                <Text style={styles.paragraph}>{currentUser?.nationalID?.idNumber}</Text>
                                <View style={styles.divider}></View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>ISSUE DATE</Text>
                                <Text style={styles.paragraph}>{currentUser?.nationalID?.id_issue_date}</Text>
                                <View style={styles.divider}></View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>EXPIRY DATE</Text>
                                <Text style={styles.paragraph}>{currentUser?.nationalID?.id_expiry_date}</Text>
                                <View style={styles.divider}></View>
                            </View>
                        </View>

                        <View style={styles.columnParent}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>MONTHLY SALARY</Text>
                                <Text style={styles.paragraph}>{`GHC ${currentUser?.monthlySalary.toLocaleString()}`}</Text>
                                <View style={styles.divider}></View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>FORBES ACC. NO</Text>
                                <Text style={styles.paragraph}>{currentUser?.accountNo}</Text>
                                <View style={styles.divider}></View>
                            </View>
                        </View>

                        <View>
                            <Text style={[styles.paragraph, { margin: '0px' }]}>
                                I, the undersigned, hereby authorizes Forbes Microfinance to deduct/withdraw 10gh from my account below for account verification and wepay card activation.
                            </Text>
                            <View style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 10, marginTop: '10px' }}>
                                <Text style={styles.label}>SIGNATURE:</Text>
                                <View>
                                    <Text style={{ margin: '10px 0' }}></Text>
                                    <View style={styles.divider}></View>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Bank */}
                    <Text style={[styles.headTitle, { marginTop: '10px' }]}>Bank Details - Official Use Only</Text>
                    <View style={{ border: '1px solid lightgrey', padding: '15px 15px 0 15px', }}>
                        <View style={styles.columnParent}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>NAME OF BANK</Text>
                                <Text style={{ margin: '5px 0' }}></Text>
                                <View style={styles.divider}></View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>BANK ACC. NO</Text>
                                <Text style={{ margin: '5px 0' }}></Text>
                                <View style={styles.divider}></View>
                            </View>
                        </View>
                        <View style={styles.columnParent}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>BRANCH</Text>
                                <Text style={{ margin: '5px 0' }}></Text>
                                <View style={styles.divider}></View>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.label}>RELATIONSHIP MANAGER</Text>
                                <Text style={{ margin: '5px 0' }}></Text>
                                <View style={styles.divider}></View>
                            </View>
                        </View>
                    </View>

                    <View>
                        <Text style={[styles.paragraph, { margin: '10px 0' }]}>
                            I, the undersigned, hereby authorizes Forbes Microfinance to deduct/withdraw the total loan due from my bank account or from any other account I may transfer this account as instructed or in the event my employer redirects my salary to another account, Forbes Microfinance LTD will have access to deduct/withdraw from same.
                        </Text>
                    </View>

                    <View style={[styles.columnParent, { marginBottom: '-10px' }]}>
                        <View style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 10 }}>
                            <Text style={styles.label}>DATE:</Text>
                            <View>
                                <Text style={{ margin: '10px 0' }}></Text>
                                <View style={styles.divider}></View>
                            </View>
                        </View>
                        <View style={{ flex: 1, display: 'flex', flexDirection: 'row', gap: 10 }}>
                            <Text style={styles.label}>SIGNATURE:</Text>
                            <View>
                                <Text style={{ margin: '10px 0' }}></Text>
                                <View style={styles.divider}></View>
                            </View>
                        </View>
                    </View>


                </View>
            </Page>
        </Document>
    );
}


export default Template