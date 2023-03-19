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
  profile.followerCount = 0
  profile.save()
}

export function handleFollowed(event: FollowedEvent): void {
  event.params.profileIds.forEach(profileId => {
    let profile = Profile.load(profileId.toHex())
    if (profile == null) {
      return
    }
    profile.followerCount++
    profile.save()
  })
}