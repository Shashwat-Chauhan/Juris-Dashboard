// eslint-disable-next-line no-unused-vars
import React from 'react'
import TeamSection from '../TeamSection'

const TeamTab = () => {
  return (
    <div className=''>
      <TeamSection designation="Founders" title="Founders" collectionName="founders" />
      <TeamSection designation="Patron-in-chief" title="Patron-in-chief" collectionName="patron-in-chief" />
      <TeamSection designation="Advisory Board" title="Advisory Board" collectionName="advisory-board" />
      <TeamSection designation="Editorial Board" title="Editorial Board" collectionName="editorial-board" />
      <TeamSection designation="Socail Media Head" title="Social Meadia Head" collectionName="social-media-head" />
      <TeamSection designation="Content Creation" title="Content Creation" collectionName="content-creation" />
      <TeamSection designation="Internship commitee" title="Internship commitee" collectionName="internship-commitee" />
    </div>
  )
}

export default TeamTab
