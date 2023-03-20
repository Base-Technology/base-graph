import { decodeUint256 } from "./util"
import {
  Followed as FollowedEvent,
  ProfileCreated as ProfileCreatedEvent,
} from "../generated/Events/Events"
import {
  Profile,
} from "../generated/schema"

export function handleProfileCreated(event: ProfileCreatedEvent): void {
  let profile = new Profile(event.params.profileId.toHex())
  profile.creator = event.params.creator
  profile.to = event.params.to
  profile.handle = event.params.handle
  profile.imageURI = event.params.imageURI
  profile.followModule = event.params.followModule
  profile.followModuleReturnData = event.params.followModuleReturnData
  profile.followNFTURI = event.params.followNFTURI
  profile.followers = new Array<string>()
  profile.followerCount = 0
  profile.save()
}

export function handleFollowed(event: FollowedEvent): void {
  for (let i = 0; i < event.params.profileIds.length; i++) {
    let profile = Profile.load(event.params.profileIds[i].toHex())
    if (profile == null) {
      return
    }
    let follower = Profile.load(decodeUint256(event.params.followModuleDatas[i]).toHex())
    if (follower == null) {
      return
    }
    let followers = profile.followers
    followers.push(follower.id)
    profile.followers = followers
    profile.followerCount++
    profile.save()
  }
}