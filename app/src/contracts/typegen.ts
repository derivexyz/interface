import { glob, runTypeChain } from 'typechain'

export default async function main() {
  const cwd = process.cwd()
  // find all files matching the glob
  const allFiles = glob(cwd, [`src/contracts/abis/+([a-zA-Z0-9_]).json`])
  await runTypeChain({
    cwd,
    filesToProcess: allFiles,
    allFiles,
    outDir: `src/contracts/typechain`,
    target: 'ethers-v5',
  })
}

main().catch(console.error)
