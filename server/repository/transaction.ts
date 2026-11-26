import "server-only";

import { getDb, type DbExecutor, type Tx } from "@/server/db/client";

export type { DbExecutor, Tx };

// Services олон хүснэгтийг нэг дор өөрчлөхдөө үүгээр transaction нээж, tx-ийг repository функцуудад дамжуулна.
export function transaction<T>(work: (tx: Tx) => Promise<T>): Promise<T> {
  return getDb().transaction(work);
}
