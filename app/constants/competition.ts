import { PositionLeaderboard, PositionLeaderboardFilter, PositionLeaderboardSortBy } from '@lyrafinance/lyra-js'

import { ONE_BN } from './bn'

export type CompetitionSeasonConfig = {
  season: number
  name: string
  startTimestamp: number
  endTimestamp: number
  pools: CompetitionPool[]
}

type RankKey = keyof Omit<PositionLeaderboard, 'positions' | 'account' | 'totalNotionalVolume' | 'totalPremiums'>

export type CompetitionPool = {
  name: string
  description: string
  rankKey: RankKey
  leaderboardFilter?: PositionLeaderboardFilter
  isRankedByPercentage?: boolean
  isRandom?: boolean
  prizes: {
    name: string
    rank: number | [number, number]
    prize: number
    winner?: string | string[]
  }[]
  totalPrizePool: number
}

export const COMPETITION_SEASONS_CONFIG: CompetitionSeasonConfig[] = [
  {
    season: 1,
    name: 'Trade The Merge',
    startTimestamp: 1662595200,
    endTimestamp: 1665126000,
    pools: [
      {
        name: 'Relative P&L',
        rankKey: 'realizedLongPnlPercentage',
        isRankedByPercentage: true,
        description:
          'Prize Pool 1 traders are ranked by relative profit / loss for longs only. This is your total profits on close or settlement for buying calls and puts.',
        leaderboardFilter: {
          minPositionIds: {
            eth: 4490,
            btc: 178,
          },
          maxCloseTimestamp: 1665131400,
          sortBy: PositionLeaderboardSortBy.RealizedLongPnlPercentage,
          minTotalPremiums: ONE_BN.mul(100),
          minTotalLongPremiums: ONE_BN,
        },
        totalPrizePool: 15000,
        prizes: [
          {
            name: '1st Place',
            rank: 1,
            prize: 2000,
            winner: '0x78D2AF013A7d1A3c6D7EdD2583F6DFd997bF0811',
          },
          {
            name: '2nd Place',
            rank: 2,
            prize: 1000,
            winner: '0xcE2bEE7d09C7d841994EbF68f72fC7b11D9eD819',
          },
          {
            name: '3rd Place',
            rank: 3,
            prize: 500,
            winner: '0x89FC72DdF7fDE474d049b3c7507172f8b6c971BF',
          },
          {
            name: '4th-10th',
            rank: [4, 10],
            prize: 250,
            winner: [
              '0x4Aebf03D68a4270100094B21114CacC3E2279b16',
              '0xeF54110C76f0B716d123645fcADCbE8fd1faD0a7',
              '0x7389D0a8017A820A2C9DeB5fae8570f19aDa4C91',
              '0xdF8a73eFab85445866B9165eaD084f808eD421ca',
              '0x716722C80757FFF31DA3F3C392A1736b7cfa3A3e',
              '0xb90781Ceb500f80A9c101225eD5451449a3Aa5bc',
              '0x47e1186B7D75037A3A9438124A3dCb777Fe30A6C',
            ],
          },
          {
            name: '11th-25th',
            rank: [11, 25],
            prize: 150,
            winner: [
              '0x1eefbe8AFfc70649E09739aCF7d21BA40f1072d7',
              '0x568CF6e9D53e1e8708C2c0D4DF23cF735DFbAB3e',
              '0xF86B92a7508958fA1b9A7e600AEE33AB7bf8664A',
              '0x446Ccd4633512f321B400cF89c1877F8307F6C26',
              '0xF623CBcE211c638A2b639672C812DcDa97ad1742',
              '0x324Fbd9536bf3d77d36137310fd4abe5130DfEA9',
              '0x5a8Ef2cc1A07b28391e6028CC0d0C907da425107',
              '0xfd79594CCA89144Aa2E5fd5f1c07BBa29FB43Bf5',
              '0xdc66f4759F4bf0184580E26A4dE697c8FD972810',
              '0x979631fB7E4B3996b3f03905C34F374039792EF6',
              '0x4341818b477DF2B2AE6e833A40a3dB48c0d95760',
              '0xf9a8dA5432f2f4053f131f70CF63CEcd08f142Ab',
              '0x58873382A3Bef85C30C148572eA4D32563a3F73a',
              '0x2e6645C4ecbdaAD32d45bb8B93aa8F84a33C5053',
              '0x21cC6b36Fa5bf6897E44E6B2a4De341e63dE984a',
            ],
          },
          {
            name: '26th-100th',
            rank: [26, 100],
            prize: 100,
            winner: [
              '0xC3cc967a2c93015Eb42FB445A6D7c8d070F8c6e6',
              '0x35C0578375D034B10Dc73d8Bb4D26F8c1bfF0001',
              '0xdCcF29fa0f10922F6284441193b0192d361101d4',
              '0x4e2483e2dA95c6311Cf1786b18Bc16D604e32207',
              '0x040479ea0dD9499befF5b8E6b36948c91165EF38',
              '0xAE04F9B82D86166430a91AD75f5360c558052909',
              '0x7E2A384c93C31E00BD8a2156bEf419f8076A5F74',
              '0xE496A0255B015405081d62ccD04A3efae484279D',
              '0xe7c0dE8937CA02F262C9357Dd7CE079C64045Bf7',
              '0x77BF7BE92a15a9E71d6686417865463935cFa5f4',
              '0x755c72635644dA821FE915118dEFC2ACD8b87Cd8',
              '0x90304795fAB3eC9F6C453B659489960578259d61',
              '0xD9a5459d5327571e817436df8531d0071E6ec292',
              '0xb79c7539459c11aacc4CE73E9809eF5Ae697e856',
              '0xA4007e5dEED110FAC652323e607c5B8F7F88E5f6',
              '0xd0110dEa716A6892335A7208FB9B3ae99bbaef7a',
              '0x4DEa22d2072941397896fc64a1585B0DdA1d16F3',
              '0x512d562209D16a09970d58374BD7025D1Aa0CE1B',
              '0xFFAA394Fb6394E2EA09f2D0FcD887a11127e4985',
              '0xeefF1559B2876E90a6CF341ac4D37e84DBA5e8C5',
              '0xf14729358C35E7a024639Ea97Aa991B2d577DAD5',
              '0xCf2b7c6Bc98bfE0D6138A25a3b6162B51F75e05d',
              '0xdFD5C26Ea2319EaC3B71EA5CEC97ae060D29fFc3',
              '0x22B1726B3336bDCC01AB7cafFb7fda662D0dA002',
              '0xaA1A54BfA93Be8Ac8D01182827433F227ba59e17',
              '0x1Fc550e98aD3021e32C47A84019F77a0792c60B7',
              '0x50555829b2C145c8F7fEB50473E42fD165c42807',
              '0x9B85BA0fc6D69e3965ceFC60e6EdEd1034856233',
              '0x648d283C9E3F4948Ad31503BF4A7b5C582A0e290',
              '0xdce7fe83d93e0ce9666c8cf0c674C3e11B6de07D',
              '0xf7F34d077dD46124274dB032F417712d514752e7',
              '0x49E59dE5DBF06ED83116AfAA0570Bfe13a8D5bA7',
              '0x6f4DEb0019b5c659d20a3F738E4eC7aD0c77Bf8a',
              '0x9bb0819842d82e6f4436bbd2E2F7D1910929a882',
              '0x79B3ba00b6bE7F0Bf6b9F198FC82ce1D4e8b6F0e',
              '0x51318c2f3e7d9735EaE7E9c9838bB972742470e5',
              '0x26975533aB856bFc7D07F6232f6DE863A8dBCcb9',
              '0x0234EA6774D6a3a3CAe7A81F5F2834071Ecc0B29',
              '0x55eAbAB96C063a61FEbEE178A9E7809c75bb02ca',
              '0xC5c38F1ca2316c3351ba91537FFC1dD80e0D257b',
              '0xbDCc576e2120cafbA4CE26f15aC4ec6cfd8cb8e2',
              '0xaA92bd09701D53A0f8089A93C354C03C73114450',
              '0x058071C9a05Ddc5C97cF9209C839E06Dc6ec4Ae9',
              '0xD7A8E69aC6A807494E8B6d7aF18d2e5268bE9Ae4',
              '0x39Aa5C9387c4c39B6DeA62dC065c05b6D77B8A86',
              '0x0E5aaD8639Da46825B796A28dD8E14468E873F52',
              '0x21BF63C0418D4f1D13f884C50498B2259B321b43',
              '0x8bF0083ECEA9bBE0b6cA47BDB3Cd1c39F10bDf02',
              '0xE10b0a47f3Ee238096E70fea6437D6FE3eA3d43e',
              '0xB779Aca7541c8e4251cFf271De0C5BA7faC377E1',
              '0xE1aA441644ebB251EC57F63365BE55D2668F5967',
              '0x78cd2a44e14529499559F374D8b39a37D2764Bf4',
              '0x13A48c3E0A403B6CF1a59FBd600E284E620b37ED',
              '0x4929f4d38F2955649b5aa34343da04cf790B9D92',
              '0xBFe2867dF4e99E4028afA19075F295f325563cb3',
              '0x2F0830b9cC296e5BAeF35381A78E77F42A1fE4Ad',
              '0xD91432eA17a0B4FF2C28Af958D4B175353C7c730',
              '0x234ef83bd3859C04C93eaafD0Ecf6dfeFE2D5A4B',
              '0x4e521c48aD5Db406507B6EB5D010A224DC2e71D6',
              '0x28552Ea8B232Fc63d6ce69692D8A723eFc5D4502',
              '0xeB8F7b8C27732e00beF318441422000D8CCd1e54',
              '0x6574080a89289178426c3065eefa43982a3C2312',
              '0xf5ED909Ff51045A4c1a8fc194809108a6F33d656',
              '0xE84b0443B8341D9C215a150Ff208c0Ce5D2D9a74',
              '0x174FE560F3d26AEB40A15fF3b90537a1A778b783',
              '0x105e025B92FafD3aaA39F45a14D84b29849E779F',
              '0x17FB2283a010c1C9e5fd435435277d7AedDC507b',
              '0x78a5C143DA26Fd7F3203E89c85faF422b70FB811',
              '0xDa85b72091828f7dD6b5091f9d90e2686F4c169e',
              '0x30e51BC5fe4eDF28FeF2681c44DEe9032D138e8d',
              '0x85afb101d9f4e3B6A7Cb2e41b2F386B3411a5C2c',
              '0xc5155B8bb375235283084081F5AD6164FDD4D4E3',
              '0x1bbDC35158e32624D270eFB1D81B2DB1B58F202D',
              '0x94a0321182F95B4b54537a6Dd78dF5750dF3513c',
              '0x38F7BBCeAb52E0ef4F3f46D9B58f76a8D2834a64',
            ],
          },
        ],
      },
      {
        name: 'Absolute P&L',
        rankKey: 'realizedPnl',
        description:
          'Prize Pool 2 traders are ranked by absolute profit / loss. This is your total profits on close or settlement for longs and shorts.',
        leaderboardFilter: {
          minPositionIds: {
            eth: 4490,
            btc: 178,
          },
          maxCloseTimestamp: 1665131400,
          sortBy: PositionLeaderboardSortBy.RealizedPnl,
          minTotalPremiums: ONE_BN.mul(100),
        },
        totalPrizePool: 15000,
        prizes: [
          {
            name: '1st Place',
            rank: 1,
            prize: 5000,
            winner: '0xd3E0d660d8Fab05B34CCb7Fe7681628d9a46c675',
          },
          {
            name: '2nd Place',
            rank: 2,
            prize: 3000,
            winner: '0xe85457D43a161168136bFc3e46Db2E9cB99EaA71',
          },
          {
            name: '3rd Place',
            rank: 3,
            prize: 2000,
            winner: '0x2D46292cbB3C601c6e2c74C32df3A4FCe99b59C7',
          },
          {
            name: '4th Place',
            rank: 4,
            prize: 1500,
            winner: '0xc87EDc449d9120CC3059890cb7E71b1D3771FF2F',
          },
          {
            name: '5th Place',
            rank: 5,
            prize: 1000,
            winner: '0xD2C32f54a26285DeCF30e6d208F722e7d5Fd3f58',
          },
          {
            name: '6th-10th',
            rank: [6, 10],
            prize: 500,
            winner: [
              '0x3A894b10Efc6893078C2b79bD25E4a1E5e028EA7',
              '0x0960Da039bb8151cacfeF620476e8bAf34Bd9565',
              '0x864d69e84BCBf88dc63c0333501B1db5D3fDBf28',
              '0x5D0aC389c669D6EFE3BA96B9878d8156f180C539',
              '0x64Af258F8522Bb9dD2c2B648B9CBBCDbe986B0BF',
            ],
          },
        ],
      },
      {
        name: 'Bridge Giveaway',
        rankKey: 'realizedLongPnlPercentage',
        isRandom: true,
        isRankedByPercentage: true,
        description:
          '5 random traders who bridge to Optimism via Hop Protocol will win 2k OP. To qualify you must be placed in the top 2k traders.',
        leaderboardFilter: {
          minPositionIds: {
            eth: 4490,
            btc: 178,
          },
          maxCloseTimestamp: 1665131400,
          sortBy: PositionLeaderboardSortBy.RealizedLongPnlPercentage,
          minTotalPremiums: ONE_BN.mul(100),
          minTotalLongPremiums: ONE_BN,
        },
        totalPrizePool: 10000,
        prizes: [
          {
            name: 'Giveaway #1',
            rank: 1,
            prize: 2500,
            winner: '0x0DAB8Ddaf5A33072080D8A4702e9dFCD385EDdcb',
          },
          {
            name: 'Giveaway #2',
            rank: 2,
            prize: 2500,
            winner: '0x79926C541D1f28f9a0ABc9C84592E31743Cd1997',
          },
          {
            name: 'Giveaway #3',
            rank: 3,
            prize: 2500,
            winner: '0x95cB32be2265A0522C283D004632eb613537f49C',
          },
          {
            name: 'Giveaway #4',
            rank: 4,
            prize: 2500,
            winner: '0xE9bB4dbb39C8A014841E4A41c2d9fe3B081D44Dd',
          },
          {
            name: 'Giveaway #5',
            rank: 5,
            prize: 2500,
            winner: '0xe29aa6DC97DE7010101bfc18eC7cdA36e53e240f',
          },
        ],
      },
    ],
  },
]

export const TRADING_COMP_PREMIUM_THRESHOLD = 100
