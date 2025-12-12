import React from "react";
import PageMeta from "../../../components/common/PageMeta";

export default function MaintenanceReport() {


    return (
        <>
            <PageMeta
                title="Maintenance Report"
                description="View and generate maintenance reports"
            />
            <div className="space-y-6">
                <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
                    <h2 className="text-base md:text-xl font-semibold text-gray-800 dark:text-white/90">
                        Maintenance Report
                    </h2>
                </div>

                <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl p-6 max-w-5xl mx-auto">
                    <div id="invoice-container" style={{ width: "100%", fontFamily: "Arial, sans-serif", border: "3px solid #000", padding: "15px", backgroundColor: "#fff" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                            <thead>
                                <tr>
                                    <td style={{ padding: "0", verticalAlign: "top" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                            <tbody>
                                                <tr>
                                                    <td style={{ padding: "0 0 10px 0", verticalAlign: "top", width: "60%" }}>
                                                        <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                                            <tr>
                                                                <td>
                                                                    <img src="/images/pdf-logo.png" alt="O'Reilly Auto Parts" style={{ maxWidth: "200px", height: "auto", marginBottom: "5px" }} />
                                                                    <div style={{ fontSize: "14px", fontWeight: "bold", marginTop: "10px", letterSpacing: "2px" }}>DEDICATED TO THE PROFESSIONAL</div>
                                                                    <div style={{ fontSize: "11px", marginTop: "3px", lineHeight: "1.4" }}>
                                                                        <div style={{}}>Store 464, 11448 AIRLINE HIGHWAY,</div>
                                                                        <div>BATON ROUGE, LA 70816 <span style={{ marginLeft: "10px" }}>(225) 292-8930</span> </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <tr>
                                                                    <td style={{ padding: "10px 0", verticalAlign: "top" }}>
                                                                        <div style={{ fontSize: "11px", lineHeight: "1.5" }}>
                                                                            <div style={{ fontWeight: "bold", marginBottom: "3px", borderBottom: "1px solid #000", paddingBottom: "3px" }}>Bill To:</div>
                                                                            <div style={{ fontWeight: "bold", fontSize: "12px" }}>TMAN TRUCKING</div>
                                                                            <div>212 WEST SHADY PL</div>
                                                                            <div>.</div>
                                                                            <div>BATON ROUGE, LA 70706</div>
                                                                            <div>(225) 936-7076</div>
                                                                        </div>
                                                                    </td>
                                                                    <td style={{ padding: "10px 0", verticalAlign: "top" }}></td>
                                                                </tr>
                                                            </tr>
                                                        </table>
                                                    </td>


                                                    <td style={{ padding: "0 0 10px 0", verticalAlign: "top", width: "40%", textAlign: "right" }}>
                                                        <table style={{ width: "100%", border: "1px solid #000", borderCollapse: "collapse", maxWidth: "310px", marginLeft: "auto" }} cellPadding="2" cellSpacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000", width: "103px" }}>
                                                                        Invoice:
                                                                    </td>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                        <strong>0464-462439</strong>
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000", width: "103px" }}>
                                                                        Sale Type
                                                                    </td>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                        CHG. CARD SALE
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000", width: "103px" }}>
                                                                        Date
                                                                    </td>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                        06/04/2025 6:08 PM
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000", width: "103px" }}>
                                                                        Ship Via
                                                                    </td>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderBottom: "1px solid #000" }}>

                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderRight: "1px solid #000", borderBottom: "1px solid #000", width: "103px" }}>
                                                                        PO Number
                                                                    </td>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "8px", borderBottom: "1px solid #000" }}>
                                                                        fleet 472612
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td colSpan={2} style={{ padding: "10px 0" }}>
                                                        <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000" }} cellPadding="5" cellSpacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ border: "1px solid #000", fontSize: "12px", padding: "3px", width: "25%", textAlign: "center" }}>Counter #</td>
                                                                    <td style={{ border: "1px solid #000", fontSize: "12px", padding: "3px", width: "25%", textAlign: "center" }}>Customer Account</td>
                                                                    <td style={{ border: "1px solid #000", fontSize: "12px", padding: "3px", width: "25%", textAlign: "center" }}>Ordered By</td>
                                                                    <td style={{ border: "1px solid #000", fontSize: "12px", padding: "3px", width: "25%", textAlign: "center" }}>Special Instructions</td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ border: "1px solid #000", fontSize: "12px", textAlign: "center", padding: "5px" }}>523287</td>
                                                                    <td style={{ border: "1px solid #000", fontSize: "12px", textAlign: "center", padding: "5px" }}>3405967</td>
                                                                    <td style={{ border: "1px solid #000", fontSize: "12px", textAlign: "center", padding: "5px" }}></td>
                                                                    <td style={{ border: "1px solid #000", fontSize: "12px", textAlign: "center", padding: "5px" }}></td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style={{ padding: "10px 0 0 0" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse", border: "none" }} cellPadding="3" cellSpacing="0">
                                            <thead>
                                                <tr>
                                                    <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Qty</th>
                                                    <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Line</th>
                                                    <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Item Number</th>
                                                    <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "left" }}>Description</th>
                                                    <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Warr</th>
                                                    <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Unit</th>
                                                    <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "center" }}>Tax</th>
                                                    <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "right" }}>List</th>
                                                    <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "right" }}>Net</th>
                                                    <th style={{ borderTop: "2px solid #000", borderBottom: "1px solid #000", fontSize: "12px", fontWeight: "bold", padding: "2px", textAlign: "right" }}>Extended</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>1</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>PFM</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>W54175</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "left" }}>PRT BER PACK</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>LT</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>EA</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>Y</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>40.66</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>23.99</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>23.99</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>1</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>MP</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>90374</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "left" }}>H-TMP GREASE</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>MD</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>EA</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>Y</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>13.54</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>7.99</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>7.99</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>1</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>MP</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>90374</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "left" }}>H-TMP GREASE</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>MD</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>EA</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>Y</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>13.54</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>7.99</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>7.99</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>1</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>VCC</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>982600</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "left" }}>5PKSHOPTOWEL</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>MD</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>RL</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>Y</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>8.46</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>4.99</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>4.99</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>1</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>ORC</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>72408</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "left" }}>140ZBRAKECLN</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>MD</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>EA</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>Y</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>7.10</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>4.19</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>4.19</td>
                                                </tr>
                                                <tr>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>2</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>BEN</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>MKD786AFM</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "left" }}>BRAKE PADS</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>LT</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>ST</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "center" }}>Y</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>127.10</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>70.60</td>
                                                    <td style={{ border: "none", fontSize: "12px", padding: "4px 2px", textAlign: "right" }}>141.20</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <div style={{ textAlign: "center", fontSize: "12px", fontWeight: "bold", marginTop: "20px" }}>**Historical Reprint**</div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td style={{ padding: "15px 0 0 0" }}>
                                        <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                            <tbody>
                                                <tr>
                                                    <td><div style={{ fontSize: "10px", marginBottom: "5px", borderBottom: "1px solid #000" }}>7 Items</div></td>
                                                </tr>
                                                <tr>
                                                    <td><div style={{ fontSize: "10px", borderTop: "2px solid #000", textAlign: "right" }}>
                                                        Chip Used: N REF #: 556891698724 AUTH CD: 175275
                                                    </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "21px" }} cellPadding="0" cellSpacing="0">
                                            <tbody>
                                                <tr>
                                                    <td style={{ verticalAlign: "bottom", width: "35%" }}>
                                                        <img src="/images/qr-code-img.jpg" alt="QR code" style={{ width: "100%", maxWidth: "90%", height: "auto" }} />
                                                    </td>
                                                    <td style={{ verticalAlign: "bottom", width: "35%" }}>
                                                        <img src="/images/bar-code-img.jpg" alt="Bar Code" style={{ width: "100%", maxWidth: "90%", height: "auto" }} />
                                                    </td>
                                                    <td style={{ verticalAlign: "top", textAlign: "right", width: "20%" }}>
                                                        <table style={{ width: "100%", borderCollapse: "collapse", marginLeft: "auto" }} cellPadding="2" cellSpacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0" }}>
                                                                        Sub-Total
                                                                    </td>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0" }}> 190.35
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0", borderBottom: "1px solid #000" }}>
                                                                        <span> Sales Tax </span>
                                                                    </td>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0", borderBottom: "1px solid #000" }}> 19.99
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0", fontWeight: "bold" }}>
                                                                        Total
                                                                    </td>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0", fontWeight: "bold" }}> 210.34
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0" }}>AMEX #1051</td>
                                                                    <td style={{ fontSize: "12px", textAlign: "right", padding: "2px 0" }}>
                                                                        210.34
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                                            <tbody>
                                                <tr>
                                                    <td style={{ width: "60%", padding: "15px 0 5px 0" }}>
                                                        <div style={{ fontSize: "15px", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "2px" }}>WWW.OREILLYPRO.COM</div>
                                                        <div style={{ fontSize: "10px", marginBottom: "8px" }}>Warranty/Garantia: www.oreillypro.com/warranty</div>
                                                    </td>
                                                    <td style={{ width: "30%", padding: "15px 0 5px 0" }}>
                                                        <div style={{ fontSize: "15px", marginBottom: "3px", textTransform: "uppercase", letterSpacing: "2px" }}>WE APPRECIATE YOUR BUSINESS!</div>
                                                        <div style={{ fontSize: "10px" }}>464WS167 Remit To: PO BOX 9464, SPRINGFIELD, MO 65801-9464</div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}



