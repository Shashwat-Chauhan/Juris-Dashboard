// eslint-disable-next-line no-unused-vars
import React from 'react'
import TeamSection from '../TeamSection'

const TeamTab = () => {
  return (
    <div className=''>
      <TeamSection designation="Founders" title="Founders" collectionName="founders" />
      <TeamSection designation="Patron-in-chief" title="Patron-in-chief" collectionName="patron-in-chief" />
      <TeamSection designation="Advisory Board" title="Advisory Board" collectionName="advisory-board" />
    </div>
  )
}

export default TeamTab
