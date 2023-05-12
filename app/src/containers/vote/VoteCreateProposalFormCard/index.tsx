import Card from '@lyra/ui/components/Card'
import CardSection from '@lyra/ui/components/Card/CardSection'
import Grid from '@lyra/ui/components/Grid'
import Input from '@lyra/ui/components/Input'
import BigNumberInput from '@lyra/ui/components/Input/BigNumberInput'
import Text from '@lyra/ui/components/Text'
import TextArea from '@lyra/ui/components/TextArea'
import { MarginProps } from '@lyra/ui/types'
import React from 'react'
import { useState } from 'react'

import { ZERO_BN } from '@/app/constants/bn'
import { Executor, EXECUTORS, ProposalAction } from '@/app/constants/governance'

import VoteCreateProposalCustomFields from './VoteCreateProposalCustomFields'
import VoteCreateProposalExecutorDropdown from './VoteCreateProposalExecutorDropdown'
import VoteCreateProposalFormButton from './VoteCreateProposalFormButton'
import VoteCreateProposalTransferFields from './VoteCreateProposalTransferFields'

type Props = MarginProps

const VoteCreateProposalFormCard = ({}: Props) => {
  const [selectedExecutor, setExecutor] = useState<Executor>(EXECUTORS[0])
  const [target, setTarget] = useState('')
  const [value, setValue] = useState(ZERO_BN)
  const [ethAmount, setEthAmount] = useState(ZERO_BN)
  const [tokenAddress, setTokenAddress] = useState('')
  const [tokenAmount, setTokenAmount] = useState(ZERO_BN)
  const [calldata, setCalldata] = useState('')
  const [title, setTitle] = useState('')
  const [summary, setSummary] = useState('')
  const [motivation, setMotivation] = useState('')
  const [specification, setSpecification] = useState('')
  const [references, setReferences] = useState('')

  return (
    <Card>
      <CardSection noSpacing>
        <Text variant="cardHeading" color="text" mb={4}>
          Proposed action (Executor) and network
        </Text>
        <VoteCreateProposalExecutorDropdown
          executors={EXECUTORS}
          selectedExecutor={selectedExecutor}
          onChangeExecutor={setExecutor}
        />
      </CardSection>
      {selectedExecutor.action === ProposalAction.TransferEth ? (
        <CardSection noSpacing>
          <Text variant="cardHeading" color="text" mb={4}>
            Target address and amount to transfer
          </Text>
          <Grid sx={{ gridTemplateColumns: ['1fr', '1fr 1fr'], gridColumnGap: [3, 6], gridRowGap: [3, 6] }}>
            <Input
              value={target}
              placeholder={'Recipient address'}
              onChange={event => {
                setTarget(event.target.value)
              }}
            />
            <BigNumberInput flexGrow={1} value={ethAmount} onChange={setEthAmount} placeholder={ZERO_BN} />
          </Grid>
        </CardSection>
      ) : null}
      {selectedExecutor.action === ProposalAction.CustomArbitrum ? (
        <CardSection noSpacing>
          <Text variant="cardHeading" color="text" mb={4}>
            Values
          </Text>
          <BigNumberInput flexGrow={1} value={value} onChange={setValue} placeholder={ZERO_BN} />
        </CardSection>
      ) : null}
      {selectedExecutor.action === ProposalAction.Transfer ? (
        <VoteCreateProposalTransferFields
          targetAddress={target}
          tokenAddress={tokenAddress}
          tokenAmount={tokenAmount}
          onChangeAmount={setTokenAmount}
          onChangeAddress={setTokenAddress}
          onChangeTargetAddress={setTarget}
        />
      ) : null}
      {selectedExecutor.action === ProposalAction.CustomEthereum ||
      selectedExecutor.action === ProposalAction.CustomArbitrum ||
      selectedExecutor.action === ProposalAction.CustomOptimism ||
      selectedExecutor.action === ProposalAction.MetaGovernance ? (
        <VoteCreateProposalCustomFields calldata={calldata} onChangeCalldata={setCalldata} />
      ) : null}
      <CardSection noSpacing>
        <Text variant="cardHeading" color="text" mb={4}>
          Proposal title, summary, motivation and specification
        </Text>
        <Input
          value={title}
          placeholder={'Title'}
          onChange={event => {
            setTitle(event.target.value)
          }}
          mb={4}
        />
        <TextArea
          value={summary}
          placeholder={'Summary'}
          onChange={event => {
            setSummary(event.target.value)
          }}
          mb={4}
        />
        <TextArea
          value={motivation}
          placeholder={'Motivation'}
          onChange={event => {
            setMotivation(event.target.value)
          }}
          mb={4}
        />
        <TextArea
          value={specification}
          placeholder={'Specification'}
          onChange={event => {
            setSpecification(event.target.value)
          }}
          mb={4}
        />
        <TextArea
          value={references}
          placeholder={'References (Optional)'}
          onChange={event => {
            setReferences(event.target.value)
          }}
          mb={4}
        />
      </CardSection>
      <CardSection noSpacing mb={8}>
        <VoteCreateProposalFormButton
          executor={selectedExecutor.address}
          action={selectedExecutor.action}
          target={target}
          ethAmount={ethAmount}
          value={value}
          tokenAddress={tokenAddress}
          tokenAmount={tokenAmount}
          calldata={calldata}
          title={title}
          summary={summary}
          motivation={motivation}
          specification={specification}
          references={references}
        />
      </CardSection>
    </Card>
  )
}

export default VoteCreateProposalFormCard
