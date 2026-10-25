// 자동 생성 — node scripts/registry.mjs (content/*/unit.json 에서). 손으로 고치지 않는다.
/* eslint-disable */
import u00_script from "../../../content/ep01-hotel-motel-hostel/script/script.json";
import u00_timing from "../../../content/ep01-hotel-motel-hostel/script/timing.json";
import u00_shorts from "../../../content/ep01-hotel-motel-hostel/script/shorts.json";
import u01_script from "../../../content/ep01f-modapman/script/script.json";
import u01_timing from "../../../content/ep01f-modapman/script/timing.json";
import u01_motion from "../../../content/ep01f-modapman/script/motion.json";
import u02_script from "../../../content/ep02-apartment-villa-officetel/script/script.json";
import u02_timing from "../../../content/ep02-apartment-villa-officetel/script/timing.json";
import u02_shorts from "../../../content/ep02-apartment-villa-officetel/script/shorts.json";
import u02_thumb from "../../../content/ep02-apartment-villa-officetel/script/thumb.json";
import u03_script from "../../../content/ep03-mart-market-department-store/script/script.json";
import u03_timing from "../../../content/ep03-mart-market-department-store/script/timing.json";
import u03_shorts from "../../../content/ep03-mart-market-department-store/script/shorts.json";
import u03_thumb from "../../../content/ep03-mart-market-department-store/script/thumb.json";
import u04_script from "../../../content/ep04-body-hair/script/script.json";
import u04_timing from "../../../content/ep04-body-hair/script/timing.json";
import u04_shorts from "../../../content/ep04-body-hair/script/shorts.json";
import u04_thumb from "../../../content/ep04-body-hair/script/thumb.json";
import u05_script from "../../../content/ep05-doctor-pharmacist-nurse/script/script.json";
import u05_timing from "../../../content/ep05-doctor-pharmacist-nurse/script/timing.json";
import u05_shorts from "../../../content/ep05-doctor-pharmacist-nurse/script/shorts.json";
import u05_thumb from "../../../content/ep05-doctor-pharmacist-nurse/script/thumb.json";
import u06_script from "../../../content/ep06-cold-flu/script/script.json";
import u06_timing from "../../../content/ep06-cold-flu/script/timing.json";
import u06_shorts from "../../../content/ep06-cold-flu/script/shorts.json";
import u06_thumb from "../../../content/ep06-cold-flu/script/thumb.json";
import u07_script from "../../../content/ep07-hospital-departments/script/script.json";
import u07_timing from "../../../content/ep07-hospital-departments/script/timing.json";
import u07_shorts from "../../../content/ep07-hospital-departments/script/shorts.json";
import u07_thumb from "../../../content/ep07-hospital-departments/script/thumb.json";
import u08_script from "../../../content/ep08-police-prosecutor-court/script/script.json";
import u08_timing from "../../../content/ep08-police-prosecutor-court/script/timing.json";
import u08_motion from "../../../content/ep08-police-prosecutor-court/script/motion.json";
import u08_shorts from "../../../content/ep08-police-prosecutor-court/script/shorts.json";
import u08_thumb from "../../../content/ep08-police-prosecutor-court/script/thumb.json";
import u09_script from "../../../content/ep08f-modapman/script/script.json";
import u09_timing from "../../../content/ep08f-modapman/script/timing.json";
import u09_motion from "../../../content/ep08f-modapman/script/motion.json";
import u10_script from "../../../content/ep09-nuri-rocket-satellite/script/script.json";
import u10_timing from "../../../content/ep09-nuri-rocket-satellite/script/timing.json";
import u10_motion from "../../../content/ep09-nuri-rocket-satellite/script/motion.json";
import u10_motionShort from "../../../content/ep09-nuri-rocket-satellite/script/motion-short.json";
import u11_script from "../../../content/ep10-hope-ufo-alien/script/script.json";
import u11_timing from "../../../content/ep10-hope-ufo-alien/script/timing.json";
import u11_motion from "../../../content/ep10-hope-ufo-alien/script/motion.json";
import u11_motionShort from "../../../content/ep10-hope-ufo-alien/script/motion-short.json";
import u12_script from "../../../content/nm01-car/script/script.json";
import u12_timing from "../../../content/nm01-car/script/timing.json";
import u12_motion from "../../../content/nm01-car/script/motion.json";
import u12_motionShort from "../../../content/nm01-car/script/motion-short.json";

export type UnitData = {
  code: string;
  format: string;
  series?: string;
  variantOf?: string;
  script: any;
  timing: any;
  motion?: any;
  shorts?: any;
  motionShort?: any;
  thumb?: any;
};

export const UNITS: UnitData[] = [
  { "code": "ep01", "format": "longform", script: u00_script, timing: u00_timing, shorts: u00_shorts },
  { "code": "ep01f", "format": "modapman", "variantOf": "ep01", script: u01_script, timing: u01_timing, motion: u01_motion },
  { "code": "ep02", "format": "longform", script: u02_script, timing: u02_timing, shorts: u02_shorts, thumb: u02_thumb },
  { "code": "ep03", "format": "longform", script: u03_script, timing: u03_timing, shorts: u03_shorts, thumb: u03_thumb },
  { "code": "ep04", "format": "longform", script: u04_script, timing: u04_timing, shorts: u04_shorts, thumb: u04_thumb },
  { "code": "ep05", "format": "longform", script: u05_script, timing: u05_timing, shorts: u05_shorts, thumb: u05_thumb },
  { "code": "ep06", "format": "longform", script: u06_script, timing: u06_timing, shorts: u06_shorts, thumb: u06_thumb },
  { "code": "ep07", "format": "longform", script: u07_script, timing: u07_timing, shorts: u07_shorts, thumb: u07_thumb },
  { "code": "ep08", "format": "longform", script: u08_script, timing: u08_timing, motion: u08_motion, shorts: u08_shorts, thumb: u08_thumb },
  { "code": "ep08f", "format": "modapman", "variantOf": "ep08", script: u09_script, timing: u09_timing, motion: u09_motion },
  { "code": "ep09", "format": "modapman", script: u10_script, timing: u10_timing, motion: u10_motion, motionShort: u10_motionShort },
  { "code": "ep10", "format": "modapman", script: u11_script, timing: u11_timing, motion: u11_motion, motionShort: u11_motionShort },
  { "code": "nm01", "format": "modapman", "series": "naemonambul", script: u12_script, timing: u12_timing, motion: u12_motion, motionShort: u12_motionShort },
];
