import {
  getProfileRepo,
  updateProfileRepo
} from "../repositories/profile.repo.js";

export async function getProfileService(userId) {
  return getProfileRepo(userId);
}

export async function updateProfileService(userId, data) {
  if (!data.name) {
    throw new Error("Tên không được để trống");
  }

  await updateProfileRepo(userId, data);
}
