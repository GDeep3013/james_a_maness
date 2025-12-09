import React from "react";
import PageMeta from "../../components/common/PageMeta";

export default function MonthlyMaintenanceReport() {
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.backgroundColor = "transparent";
    e.target.style.outline = "none";
    e.target.style.boxShadow = "none";
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.backgroundColor = "#f1f4ff";
  };

  return (
    <>
      <PageMeta
        title="Monthly Maintenance Reports (MMR)"
        description="View and generate monthly maintenance reports"
      />
      <div className="space-y-6">
        <div className="page-actions flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-base md:text-xl font-semibold text-gray-800 dark:text-white/90">
            Monthly Maintenance Reports (MMR)
          </h2>
        </div>

        <div className="">
          <div id="mmr-form-container" style={{ width: "100%", fontFamily: "Arial, sans-serif" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", margin: "0 auto" }} cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={{ padding: "20px", textAlign: "center" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={{ textAlign: "center", backgroundColor: "#e1e1e1", color: "#000", fontSize: "18px", fontWeight: "bold", paddingBottom: "10px", paddingTop: "10px", border: "2px solid #000" }}>
                            U.S. Monthly Maintenance Record, MGBA-355
                          </td>
                        </tr>
                        <tr>
                          <td style={{ textAlign: "right", fontSize: "14px", paddingTop: "10px", width: "150px", fontWeight: "bold", paddingLeft: "10px" }}>
                            14 May 2025
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "0 20px 15px 20px", fontSize: "14px", lineHeight: "1.5", textAlign: "justify" }}>
                    To comply with U.S. Federal Regulations, this form must be completed, signed, and submitted to FedEx by the 20th of the month following the month for which repairs, or maintenance were performed on any service provider-owned or -leased equipment. Submit one record for each piece of equipment, even if not regularly providing services.
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "0 20px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="5" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={{ fontSize: "12px", padding: "8px 20px 8px 8px", verticalAlign: "top", width: "35%" }}>
                            <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>Maintenance Record for the Month and Year of:</span>
                            <input type="text" style={{ width: "100%", backgroundColor: "#f1f4ff", border: "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: "none" }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                          <td style={{ fontSize: "12px", padding: "8px 5px 8px 20px", verticalAlign: "top", width: "35%" }}>
                            <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>Domicile Station/Hub:</span>
                            <input type="text" style={{ width: "100%", backgroundColor: "#f1f4ff", border: "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: "none" }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontSize: "12px", padding: "8px 20px 8px 8px", verticalAlign: "top", width: "35%" }}>
                            <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>Service Provider Company Name:</span>
                            <input type="text" style={{ width: "100%", backgroundColor: "#f1f4ff", border: "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: "none" }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                          <td style={{ fontSize: "12px", padding: "8px 5px 8px 20px", verticalAlign: "top", width: "35%" }}>
                            <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>Current Mileage* (Odometer Reading)</span>
                            <input type="text" style={{ width: "100%", backgroundColor: "#f1f4ff", border: "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: "none" }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontSize: "12px", padding: "8px 20px 8px 8px", verticalAlign: "top", width: "35%" }}>
                            <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>Vehicle Unit #:</span>
                            <input type="text" style={{ width: "100%", backgroundColor: "#f1f4ff", border: "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: "none" }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                          <td style={{ fontSize: "12px", padding: "8px 5px 8px 20px", verticalAlign: "top", width: "35%" }}>
                            <p>*If reading has decreased due to odometer repair/replacement, proof
                              should also be provided. If unit is undergoing repair and unavailable,
                              “N/A” may be utilized for current mileage.</p>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "15px 20px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="5" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={{ fontSize: "14px", lineHeight: '1.5', padding: "8px 5px", verticalAlign: "top", width: "70%" }}>
                            Were any repairs, or preventative maintenance performed on this unit?
                          </td>
                          <td style={{ padding: "8px 5px", verticalAlign: "top", width: "30%" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td style={{ padding: "0 10px 0 0", fontSize: "12px" }}>
                                    <input type="checkbox" style={{ marginRight: "5px", backgroundColor: "#f1f4ff", width: "23px", height: "23px", border: "1px solid #000", verticalAlign: "middle", accentColor: "#f1f4ff" }} />
                                    Yes
                                  </td>
                                  <td style={{ padding: "0", fontSize: "12px" }}>
                                    <input type="checkbox" style={{ marginRight: "5px", backgroundColor: "#f1f4ff", width: "23px", height: "23px", border: "1px solid #000", verticalAlign: "middle", accentColor: "#f1f4ff" }} />
                                    No
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontSize: "14px", lineHeight: '1.5', padding: "8px 5px", verticalAlign: "top" }}>
                            If "no" maintenance was performed, was the unit out of service and unable to provide service (i.e., awaiting repair, on litigation hold, etc.)?
                          </td>
                          <td style={{ padding: "8px 5px", verticalAlign: "top" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td style={{ padding: "0 10px 0 0", fontSize: "12px" }}>
                                    <input type="checkbox" style={{ marginRight: "5px", backgroundColor: "#f1f4ff", width: "23px", height: "23px", border: "1px solid #000", verticalAlign: "middle", accentColor: "#f1f4ff" }} />
                                    Yes
                                  </td>
                                  <td style={{ padding: "0", fontSize: "12px" }}>
                                    <input type="checkbox" style={{ marginRight: "5px", backgroundColor: "#f1f4ff", width: "23px", height: "23px", border: "1px solid #000", verticalAlign: "middle", accentColor: "#f1f4ff" }} />
                                    No
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "15px 20px", fontSize: "11px", lineHeight: "1.6" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={{ fontSize: "14px", lineHeight: '1.5', paddingBottom: "10px", textAlign: "justify" }}>
                            All repairs/replacements, or maintenance performed in conformance with a vehicle's Maintenance Interval Form or any other major vehicle system must be reported on an MMR with detailed notations or attached receipts.
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontSize: "14px", lineHeight: '1.5', paddingBottom: "10px", textAlign: "justify" }}>
                            All notations must provide enough detail for a DOT official to determine what component(s), location(s), and type of work was performed (e.g., replace, repair, adjust, etc.).
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontSize: "14px", lineHeight: '1.5', paddingBottom: "10px", textAlign: "justify" }}>
                            Annual Federal/State and Pre/Post trip inspections must not be reported on the MMR, however repairs and maintenance of components that resulted from these inspections must be reported on an MMR.
                          </td>
                        </tr>
                        <tr>
                          <td style={{ fontSize: "14px", lineHeight: '1.5', paddingBottom: "10px", textAlign: "justify" }}>
                            General maintenance (e.g., oil/filter changes, lubrication, adjustments) should be reported with adequate detail to clearly convey what components were repaired or maintained. Abbreviations such as "LOF" or "PM" cannot be used, as these do not provide adequate details.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "15px 20px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", border: "1px solid #000" }} cellPadding="5" cellSpacing="0">
                      <thead>
                        <tr>
                          <th style={{ border: "1px solid #000", padding: "8px", fontSize: "12px", fontWeight: "bold", textAlign: "left", width: "25%" }}>
                            Date of Maintenance
                          </th>
                          <th style={{ border: "1px solid #000", padding: "8px", fontSize: "12px", fontWeight: "bold", textAlign: "left", width: "75%" }}>
                            Specific Description of Maintenance Performed
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ border: "1px solid #000", padding: "0",   verticalAlign: "top" }}>
                            <input type="text" style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px", minHeight: "30px", boxSizing: "border-box", textAlign: 'center', outline: 'none', backgroundColor: '#f1f4ff' }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                          <td style={{ border: "1px solid #000", padding: "0",   verticalAlign: "top" }}>
                            <input type="text" style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px", minHeight: "30px", boxSizing: "border-box", textAlign: 'center', outline: 'none', backgroundColor: '#f1f4ff' }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: "1px solid #000", padding: "0",   verticalAlign: "top" }}>
                            <input type="text" style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px", minHeight: "30px", boxSizing: "border-box", textAlign: 'center', outline: 'none', backgroundColor: '#f1f4ff' }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                          <td style={{ border: "1px solid #000", padding: "0",   verticalAlign: "top" }}>
                            <input type="text" style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px", minHeight: "30px", boxSizing: "border-box", textAlign: 'center', outline: 'none', backgroundColor: '#f1f4ff' }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: "1px solid #000", padding: "0",   verticalAlign: "top" }}>
                            <input type="text" style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px", minHeight: "30px", boxSizing: "border-box", textAlign: 'center', outline: 'none', backgroundColor: '#f1f4ff' }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                          <td style={{ border: "1px solid #000", padding: "0",   verticalAlign: "top" }}>
                            <input type="text" style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px", minHeight: "30px", boxSizing: "border-box", textAlign: 'center', outline: 'none', backgroundColor: '#f1f4ff' }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: "1px solid #000", padding: "0",   verticalAlign: "top" }}>
                            <input type="text" style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px", minHeight: "30px", boxSizing: "border-box", textAlign: 'center', outline: 'none', backgroundColor: '#f1f4ff' }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                          <td style={{ border: "1px solid #000", padding: "0",   verticalAlign: "top" }}>
                            <input type="text" style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px", minHeight: "30px", boxSizing: "border-box", textAlign: 'center', outline: 'none', backgroundColor: '#f1f4ff' }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                        </tr>
                        <tr>
                          <td style={{ border: "1px solid #000", padding: "0",   verticalAlign: "top" }}>
                            <input type="text" style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px", minHeight: "30px", boxSizing: "border-box", textAlign: 'center', outline: 'none', backgroundColor: '#f1f4ff' }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                          <td style={{ border: "1px solid #000", padding: "0",   verticalAlign: "top" }}>
                            <input type="text" style={{ width: "100%", border: "none", padding: "5px", fontSize: "12px", minHeight: "30px", boxSizing: "border-box", textAlign: 'center', outline: 'none', backgroundColor: '#f1f4ff' }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                          </td>
                        </tr>
                        
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "20px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="5" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={{ fontSize: "11px", lineHeight: "1.6", textAlign: "justify", paddingBottom: "15px" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td style={{ width: "30px", verticalAlign: "top", paddingTop: "3px" }}>
                                    <input type="checkbox" style={{ width: "23px", height: "23px", verticalAlign: "top", accentColor: '#f1f4ff' }} />
                                  </td>
                                  <td style={{ fontSize: "14px", lineHeight: '1.5', textAlign: "justify" }}>
                                    By checking this box, I declare that this record is true and correct. Unless otherwise clearly indicated as "out of service" on this record, I confirm that the equipment on this record is in compliance with the Federal Motor Carrier Safety Regulations 49 C.F.R. 396.3(a)(1) and 396.7 (a) and is in safe operating condition and meets all federal, state and local motor vehicle laws. Furthermore, I confirm that preventative maintenance is consistent with the interval schedule per 396.3(b)(2).
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="5" cellSpacing="0">
                              <tbody>
                                <tr>
                                  <td style={{ fontSize: "12px", padding: "8px 20px 8px 8px", verticalAlign: "top", width: "50%" }}>
                                    <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>Signature of Authorized Officer or Business Contact:</span>
                                    <input type="text" style={{ width: "100%", border: "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: 'none', backgroundColor: '#f1f4ff' }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                                  </td>
                                  <td style={{ fontSize: "12px", padding: "8px 8px 8px 20px", verticalAlign: "top", width: "50%" }}>
                                    <span style={{ fontWeight: "bold", paddingLeft: "10px", paddingBottom: "5px", fontSize: "14px" }}>Date Completed:</span>
                                    <input type="text" style={{ width: "100%", border: "1px solid #000", padding: "5px", fontSize: "12px", minHeight: "25px", boxSizing: "border-box", outline: 'none', backgroundColor: '#f1f4ff' }} onFocus={handleInputFocus} onBlur={handleInputBlur} autoComplete="off" />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>

                <tr>
                  <td style={{ padding: "20px 20px 10px 20px", fontSize: "10px", lineHeight: "1.5", borderTop: "1px solid #ccc" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }} cellPadding="0" cellSpacing="0">
                      <tbody>
                        <tr>
                          <td style={{fontSize: "14px", lineHeight: '1.5', padding: "8px 0 21px 0", textAlign: "justify", fontStyle: 'italic' }}>
                            * The Monthly Maintenance Record (MMR) is FedEx's systematic method of obtaining vehicle maintenance records for service provider-owned vehicles in compliance with the Federal Motor Carrier Safety Regulations which require motor carriers to have a systematic method of causing vehicles operating under their motor carrier operating authority to be repaired and maintained. Therefore, if FedEx does not receive records for a vehicle by the 20th of the month following the month in which maintenance or repairs, were performed, packages will not be made available to this vehicle.
                          </td>
                        </tr>
                        <tr>
                          <td style={{ borderTop: "1px solid #000", padding: "5px", fontSize: "13px", lineHeight: '1.5', paddingBottom: "5px",}}>
                            This form for service providers is accessed through mybizaccount.fedex.com
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}



