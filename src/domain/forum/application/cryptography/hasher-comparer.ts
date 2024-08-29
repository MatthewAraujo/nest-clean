export abstract class HasherCompare {
  abstract compare(plain: string, hash: string): Promise<boolean>
}
