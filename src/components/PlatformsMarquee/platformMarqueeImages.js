/**
 * Build fallback URLs from the same list as manifest (if fetch fails).
 */
import { filenamesToUrls } from "./marqueeResource";

const PREFIX =
  "c__Users_vidyamgcpapril_AppData_Roaming_Cursor_User_workspaceStorage_65d4a4d0efecbbdb517a1eba159d064a_images_";

const rawNames = [
  `${PREFIX}Screenshot_2026-02-17-16-38-22-62_92460851df6f172a4592fca41cc2d2e6-b64935c5-01dd-4222-b88f-812875300474.png`,
  `${PREFIX}WhatsApp_Image_2026-02-17_at_12.30.54-214981cb-c8e2-4c48-9598-d23e06575571.png`,
  `${PREFIX}IMG-20260410-WA0021-7f4e11a1-7cd0-4332-ac17-39d936bba0fc.png`,
  `${PREFIX}IMG-20260410-WA0019-dc562bee-1c86-4c2e-94b6-c604d46df5d2.png`,
  `${PREFIX}IMG-20260417-WA0166-7dca0d62-966b-4768-953a-4f9306293d25.png`,
  `${PREFIX}IMG_20260217_164452-f5387162-ff17-4dd2-9d5b-87f36512f5fa.png`,
  `${PREFIX}IMG-20260417-WA0095-c6b82ea0-4582-4232-8c59-6a6588a79724.png`,
  `${PREFIX}IMG-20260417-WA0103-0e2c83e5-af2a-408c-bd8f-5a7637edbe26.png`,
  `${PREFIX}IMG-20260417-WA0085-4d77fd35-e7ed-4b4c-bcf1-d77e1ec1ddf7.png`,
  `${PREFIX}IMG-20260417-WA0054-1580c12b-58bd-4025-948c-b16be465c11d.png`,
  `${PREFIX}IMG-20260417-WA0183-14335e42-7bc9-4d69-9828-fbefc96457bb.png`,
  `${PREFIX}IMG_20260321_084943-99fd8ca3-e798-436a-a150-267c1a821f71.png`,
  `${PREFIX}Screenshot_2026-02-17-16-37-55-12_92460851df6f172a4592fca41cc2d2e6-210d6bf9-ace1-4d60-b748-14c1fa4936fa.png`,
  `${PREFIX}Screenshot_2026-02-17-16-41-51-65_92460851df6f172a4592fca41cc2d2e6-ef19590a-e8a7-40d6-a2bb-e34568f2cdc2.png`,
  `${PREFIX}IMG_6356-37f70dfa-b72f-43fe-b3ff-3da7af617574.png`,
  `${PREFIX}IMG20260319121540-ddfe4f04-0061-4907-97a4-7d602b726161.png`,
  `${PREFIX}IMG20260319113311-056ecea7-4e27-4531-9261-9726a8c1fb58.png`,
  `${PREFIX}IMG20260415112907-e8e286d7-c369-4053-9d05-f0040c29d4b6.png`,
];

const platformMarqueeImages = filenamesToUrls(rawNames);

export default platformMarqueeImages;
