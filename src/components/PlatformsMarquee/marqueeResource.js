/**
 * Marquee image list: excluded reference/mock files + URL builder.
 * Edit public/images/marquee/manifest.json to add/remove images without changing code.
 */
const EXCLUDED = [
  "c__Users_vidyamgcpapril_AppData_Roaming_Cursor_User_workspaceStorage_65d4a4d0efecbbdb517a1eba159d064a_images__E637AB76-B9A2-4F51-8C1E-9C39F48F3912_-f82f68e4-7543-4950-bca8-5bed107553b8.png",
  "c__Users_vidyamgcpapril_AppData_Roaming_Cursor_User_workspaceStorage_65d4a4d0efecbbdb517a1eba159d064a_images_E637AB76-B9A2-4F51-8C1E-9C39F48F3912_-f82f68e4-7543-4950-bca8-5bed107553b8.png",
  "c__Users_vidyamgcpapril_AppData_Roaming_Cursor_User_workspaceStorage_65d4a4d0efecbbdb517a1eba159d064a_images__D730F67F-CEF9-4959-881D-F020F47C0A91_-74dd24db-746b-4089-a4c9-a4c608ad1a4d.png",
  "c__Users_vidyamgcpapril_AppData_Roaming_Cursor_User_workspaceStorage_65d4a4d0efecbbdb517a1eba159d064a_images_image-d21a958c-f6b6-431b-b1c7-04e37dfdd705.png",
];

export function shouldIncludeMarqueeFile(name) {
  if (typeof name !== "string" || !name.trim()) {
    return false;
  }
  if (EXCLUDED.includes(name)) {
    return false;
  }
  if (
    /E637AB76-B9A2-4F51-8C1E-9C39F48F3912/.test(name) ||
    /D730F67F-CEF9-4959-881D-F020F47C0A91/.test(name) ||
    /FFBF0A26-0783-4DBD-94FB-EA80A8BF00FC/.test(name) ||
    /914F3237-2FB3-4677-A1C7-6AEDA8E32AB2/.test(name) ||
    /518F4F03-9A18-44C5-946D-305BC5F0BFDF/.test(name) ||
    /image-d21a958c-f6b6-431b-b1c7-04e37dfdd705/.test(name)
  ) {
    return false;
  }
  return true;
}

export function filenamesToUrls(filenames) {
  return filenames
    .filter(shouldIncludeMarqueeFile)
    .map((name) => `/images/marquee/${encodeURIComponent(name)}`);
}
