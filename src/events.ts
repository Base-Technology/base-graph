import { decodeUint256 } from "./util"
import {
  Followed as FollowedEvent,
  ProfileCreated as ProfileCreatedEvent,
  PostCreated as PostCreatedEvent,
  CommentCreated as CommentCreatedEvent,
} from "../generated/Events/Events"
import {
  Profile,
  Publication,
  Comment,
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
  profile.followers = []
  profile.followerCount = 0
  profile.followings = []
  profile.followingCount = 0
  profile.publications = []
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
    let followings = follower.followings
    followings.push(profile.id)
    follower.followings = followings
    follower.followingCount++
    follower.save()
  }
}

export function handlePostCreated(event: PostCreatedEvent): void {
  let publication = new Publication(event.params.profileId.toHex() + "_" + event.params.pubId.toHex())
  publication.profileId = event.params.profileId
  publication.pubId = event.params.pubId
  publication.contentURI = event.params.contentURI
  publication.collectModule = event.params.collectModule
  publication.collectModuleReturnData = event.params.collectModuleReturnData
  publication.referenceModule = event.params.referenceModule
  publication.referenceModuleReturnData = event.params.referenceModuleReturnData
  publication.comments = []
  publication.commentCount = 0
  publication.save()

  let profile = Profile.load(event.params.profileId.toHex())
  if (profile == null) {
    return
  }
  let publications = profile.publications
  publications.push(publication.id)
  profile.publications = publications
  profile.save()
}

export function handleCommentCreated(event: CommentCreatedEvent): void {
  let comment = new Comment(event.transaction.hash.concatI32(event.logIndex.toI32()).toHex())
  comment.profileId = event.params.profileId
  comment.pubId = event.params.pubId
  comment.contentURI = event.params.contentURI
  comment.profileIdPointed = event.params.profileIdPointed
  comment.pubIdPointed = event.params.pubIdPointed
  comment.referenceModuleData = event.params.referenceModuleData
  comment.collectModule = event.params.collectModule
  comment.collectModuleReturnData = event.params.collectModuleReturnData
  comment.referenceModule = event.params.referenceModule
  comment.referenceModuleReturnData = event.params.referenceModuleReturnData
  comment.save()

  let publication = Publication.load(event.params.profileIdPointed.toHex() + "_" + event.params.pubIdPointed.toHex())
  if (publication == null) {
    return
  }
  let comments = publication.comments
  comments.push(comment.id)
  publication.comments = comments
  publication.commentCount++
  publication.save()

  publication = new Publication(event.params.profileId.toHex() + "_" + event.params.pubId.toHex())
  publication.profileId = event.params.profileId
  publication.pubId = event.params.pubId
  publication.contentURI = event.params.contentURI
  publication.comments = []
  publication.commentCount = 0
  publication.save()

  let profile = Profile.load(event.params.profileId.toHex())
  if (profile == null) {
    return
  }
  let publications = profile.publications
  publications.push(publication.id)
  profile.publications = publications
  profile.save()
}