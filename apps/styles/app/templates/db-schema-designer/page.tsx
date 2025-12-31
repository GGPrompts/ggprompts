"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Database,
  Plus,
  Trash2,
  Download,
  Upload,
  Copy,
  Check,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Grid3x3,
  Link as LinkIcon,
  Unlink,
  Key,
  FileCode,
  Save,
  FolderOpen,
  Settings2,
  ArrowRight,
  Edit,
  X,
  GripVertical,
  Table as TableIcon,
  Columns,
  Code2,
  FileJson,
  Image as ImageIcon,
} from "lucide-react"
import { Card, Button, Input, Label, Textarea, Badge, Switch, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@ggprompts/ui"

// Types
interface Column {
  id: string
  name: string
  type: string
  length?: number
  nullable: boolean
  primaryKey: boolean
  foreignKey: boolean
  foreignTable?: string
  foreignColumn?: string
  unique: boolean
  defaultValue?: string
  index: boolean
}

interface DBTable {
  id: string
  name: string
  x: number
  y: number
  columns: Column[]
  description?: string
}

interface Relationship {
  id: string
  fromTable: string
  fromColumn: string
  toTable: string
  toColumn: string
  type: "one-to-one" | "one-to-many" | "many-to-many"
  onDelete?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION"
  onUpdate?: "CASCADE" | "SET NULL" | "RESTRICT" | "NO ACTION"
}

interface Schema {
  tables: DBTable[]
  relationships: Relationship[]
}

// SQL Data Types
const SQL_TYPES = [
  "VARCHAR",
  "TEXT",
  "INT",
  "BIGINT",
  "SMALLINT",
  "DECIMAL",
  "FLOAT",
  "BOOLEAN",
  "DATE",
  "DATETIME",
  "TIMESTAMP",
  "TIME",
  "JSON",
  "UUID",
  "BLOB",
]

// Sample schemas
const SAMPLE_SCHEMAS: Record<string, Schema> = {
  ecommerce: {
    tables: [
      {
        id: "t1",
        name: "users",
        x: 100,
        y: 100,
        columns: [
          { id: "c1", name: "id", type: "INT", nullable: false, primaryKey: true, foreignKey: false, unique: false, index: true },
          { id: "c2", name: "email", type: "VARCHAR", length: 255, nullable: false, primaryKey: false, foreignKey: false, unique: true, index: true },
          { id: "c3", name: "name", type: "VARCHAR", length: 100, nullable: false, primaryKey: false, foreignKey: false, unique: false, index: false },
          { id: "c4", name: "created_at", type: "TIMESTAMP", nullable: false, primaryKey: false, foreignKey: false, unique: false, index: false, defaultValue: "CURRENT_TIMESTAMP" },
        ],
      },
      {
        id: "t2",
        name: "products",
        x: 500,
        y: 100,
        columns: [
          { id: "c5", name: "id", type: "INT", nullable: false, primaryKey: true, foreignKey: false, unique: false, index: true },
          { id: "c6", name: "name", type: "VARCHAR", length: 200, nullable: false, primaryKey: false, foreignKey: false, unique: false, index: false },
          { id: "c7", name: "price", type: "DECIMAL", nullable: false, primaryKey: false, foreignKey: false, unique: false, index: false },
          { id: "c8", name: "category_id", type: "INT", nullable: true, primaryKey: false, foreignKey: true, unique: false, index: true },
        ],
      },
      {
        id: "t3",
        name: "orders",
        x: 300,
        y: 400,
        columns: [
          { id: "c9", name: "id", type: "INT", nullable: false, primaryKey: true, foreignKey: false, unique: false, index: true },
          { id: "c10", name: "user_id", type: "INT", nullable: false, primaryKey: false, foreignKey: true, unique: false, index: true, foreignTable: "users", foreignColumn: "id" },
          { id: "c11", name: "total", type: "DECIMAL", nullable: false, primaryKey: false, foreignKey: false, unique: false, index: false },
          { id: "c12", name: "status", type: "VARCHAR", length: 50, nullable: false, primaryKey: false, foreignKey: false, unique: false, index: true },
          { id: "c13", name: "created_at", type: "TIMESTAMP", nullable: false, primaryKey: false, foreignKey: false, unique: false, index: false },
        ],
      },
      {
        id: "t4",
        name: "order_items",
        x: 700,
        y: 400,
        columns: [
          { id: "c14", name: "id", type: "INT", nullable: false, primaryKey: true, foreignKey: false, unique: false, index: true },
          { id: "c15", name: "order_id", type: "INT", nullable: false, primaryKey: false, foreignKey: true, unique: false, index: true, foreignTable: "orders", foreignColumn: "id" },
          { id: "c16", name: "product_id", type: "INT", nullable: false, primaryKey: false, foreignKey: true, unique: false, index: true, foreignTable: "products", foreignColumn: "id" },
          { id: "c17", name: "quantity", type: "INT", nullable: false, primaryKey: false, foreignKey: false, unique: false, index: false },
          { id: "c18", name: "price", type: "DECIMAL", nullable: false, primaryKey: false, foreignKey: false, unique: false, index: false },
        ],
      },
    ],
    relationships: [
      {
        id: "r1",
        fromTable: "orders",
        fromColumn: "user_id",
        toTable: "users",
        toColumn: "id",
        type: "one-to-many",
        onDelete: "CASCADE",
      },
      {
        id: "r2",
        fromTable: "order_items",
        fromColumn: "order_id",
        toTable: "orders",
        toColumn: "id",
        type: "one-to-many",
        onDelete: "CASCADE",
      },
      {
        id: "r3",
        fromTable: "order_items",
        fromColumn: "product_id",
        toTable: "products",
        toColumn: "id",
        type: "one-to-many",
      },
    ],
  },
}

export default function DBSchemaDesigner() {
  // State
  const [schema, setSchema] = useState<Schema>(SAMPLE_SCHEMAS.ecommerce)
  const [selectedTable, setSelectedTable] = useState<string | null>(null)
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)
  const [showGrid, setShowGrid] = useState(true)
  const [copied, setCopied] = useState(false)
  const [sqlDialect, setSqlDialect] = useState<"postgresql" | "mysql" | "sqlite" | "sqlserver">("postgresql")
  const [showTableDialog, setShowTableDialog] = useState(false)
  const [showColumnDialog, setShowColumnDialog] = useState(false)
  const [editingTable, setEditingTable] = useState<DBTable | null>(null)
  const [editingColumn, setEditingColumn] = useState<Column | null>(null)
  const [newTableName, setNewTableName] = useState("")
  const [newColumnData, setNewColumnData] = useState<Partial<Column>>({
    name: "",
    type: "VARCHAR",
    nullable: true,
    primaryKey: false,
    foreignKey: false,
    unique: false,
    index: false,
  })
  const canvasRef = useRef<HTMLDivElement>(null)
  const [draggingTable, setDraggingTable] = useState<string | null>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })

  // Add new table
  const addTable = () => {
    const newTable: DBTable = {
      id: `t${Date.now()}`,
      name: newTableName || "new_table",
      x: 100,
      y: 100,
      columns: [
        {
          id: `c${Date.now()}`,
          name: "id",
          type: "INT",
          nullable: false,
          primaryKey: true,
          foreignKey: false,
          unique: false,
          index: true,
        },
      ],
    }
    setSchema(prev => ({ ...prev, tables: [...prev.tables, newTable] }))
    setNewTableName("")
    setShowTableDialog(false)
  }

  // Delete table
  const deleteTable = (tableId: string) => {
    setSchema(prev => ({
      tables: prev.tables.filter(t => t.id !== tableId),
      relationships: prev.relationships.filter(
        r => r.fromTable !== tableId && r.toTable !== tableId
      ),
    }))
    if (selectedTable === tableId) setSelectedTable(null)
  }

  // Add column to table
  const addColumn = (tableId: string) => {
    const newColumn: Column = {
      id: `c${Date.now()}`,
      name: newColumnData.name || "new_column",
      type: newColumnData.type || "VARCHAR",
      length: newColumnData.length,
      nullable: newColumnData.nullable ?? true,
      primaryKey: newColumnData.primaryKey ?? false,
      foreignKey: newColumnData.foreignKey ?? false,
      unique: newColumnData.unique ?? false,
      index: newColumnData.index ?? false,
      defaultValue: newColumnData.defaultValue,
    }

    setSchema(prev => ({
      ...prev,
      tables: prev.tables.map(t =>
        t.id === tableId ? { ...t, columns: [...t.columns, newColumn] } : t
      ),
    }))

    setNewColumnData({
      name: "",
      type: "VARCHAR",
      nullable: true,
      primaryKey: false,
      foreignKey: false,
      unique: false,
      index: false,
    })
    setShowColumnDialog(false)
  }

  // Delete column
  const deleteColumn = (tableId: string, columnId: string) => {
    setSchema(prev => ({
      ...prev,
      tables: prev.tables.map(t =>
        t.id === tableId
          ? { ...t, columns: t.columns.filter(c => c.id !== columnId) }
          : t
      ),
    }))
  }

  // Generate SQL
  const generateSQL = (): string => {
    let sql = ""
    const delimiter = sqlDialect === "sqlserver" ? "GO" : ";"

    // CREATE TABLE statements
    schema.tables.forEach(table => {
      sql += `CREATE TABLE ${table.name} (\n`

      const columnDefs = table.columns.map(col => {
        let def = `  ${col.name} ${col.type}`

        if (col.length && (col.type === "VARCHAR" || col.type === "DECIMAL")) {
          def += `(${col.length})`
        }

        if (!col.nullable) def += " NOT NULL"
        if (col.unique && !col.primaryKey) def += " UNIQUE"
        if (col.defaultValue) def += ` DEFAULT ${col.defaultValue}`
        if (col.primaryKey) def += " PRIMARY KEY"

        return def
      })

      sql += columnDefs.join(",\n")
      sql += `\n)${delimiter}\n\n`
    })

    // ALTER TABLE for foreign keys
    schema.relationships.forEach(rel => {
      const fromTable = schema.tables.find(t => t.id === rel.fromTable)
      const toTable = schema.tables.find(t => t.id === rel.toTable)

      if (fromTable && toTable) {
        sql += `ALTER TABLE ${fromTable.name}\n`
        sql += `  ADD CONSTRAINT fk_${fromTable.name}_${toTable.name}\n`
        sql += `  FOREIGN KEY (${rel.fromColumn})\n`
        sql += `  REFERENCES ${toTable.name}(${rel.toColumn})`

        if (rel.onDelete) sql += `\n  ON DELETE ${rel.onDelete}`
        if (rel.onUpdate) sql += `\n  ON UPDATE ${rel.onUpdate}`

        sql += `${delimiter}\n\n`
      }
    })

    return sql.trim()
  }

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Export as JSON
  const exportJSON = () => {
    const json = JSON.stringify(schema, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "schema.json"
    a.click()
  }

  // Export as SQL
  const exportSQL = () => {
    const sql = generateSQL()
    const blob = new Blob([sql], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `schema_${sqlDialect}.sql`
    a.click()
  }

  // Handle table drag
  const handleMouseDown = (e: React.MouseEvent, tableId: string) => {
    const table = schema.tables.find(t => t.id === tableId)
    if (!table) return

    setDraggingTable(tableId)
    setOffset({
      x: e.clientX - table.x * (zoom / 100),
      y: e.clientY - table.y * (zoom / 100),
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingTable) return

    const newX = (e.clientX - offset.x) / (zoom / 100)
    const newY = (e.clientY - offset.y) / (zoom / 100)

    setSchema(prev => ({
      ...prev,
      tables: prev.tables.map(t =>
        t.id === draggingTable ? { ...t, x: newX, y: newY } : t
      ),
    }))
  }

  const handleMouseUp = () => {
    setDraggingTable(null)
  }

  // Get relationship path
  const getRelationshipPath = (rel: Relationship): string => {
    const fromTable = schema.tables.find(t => t.id === rel.fromTable)
    const toTable = schema.tables.find(t => t.id === rel.toTable)

    if (!fromTable || !toTable) return ""

    const fromX = fromTable.x + 150
    const fromY = fromTable.y + 50
    const toX = toTable.x + 150
    const toY = toTable.y + 50

    // Simple curved line
    const midX = (fromX + toX) / 2
    const midY = (fromY + toY) / 2
    const curve = Math.abs(fromY - toY) / 4

    return `M ${fromX} ${fromY} Q ${midX} ${midY - curve}, ${toX} ${toY}`
  }

  const selectedTableData = schema.tables.find(t => t.id === selectedTable)

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-[1800px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 space-y-4"
        >
          <div className="flex items-center justify-center gap-3">
            <div className="relative">
              <Database className="w-12 h-12 text-primary" />
              <motion.div
                className="absolute inset-0 bg-primary/20 blur-xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <h1 className="text-5xl font-bold terminal-glow font-mono bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Database Schema Designer</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Visual database design with SQL generation
          </p>
          <div className="flex items-center justify-center gap-2">
            <Badge variant="outline" className="border-primary/30 text-primary">
              {schema.tables.length} tables
            </Badge>
            <Badge variant="outline" className="border-secondary/30 text-secondary">
              {schema.tables.reduce((acc, t) => acc + t.columns.length, 0)} columns
            </Badge>
            <Badge variant="outline" className="border-amber-500/30 text-amber-400">
              {schema.relationships.length} relationships
            </Badge>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6"
        >
          <Card className="glass border-white/10 p-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Button onClick={() => setShowTableDialog(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Table
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <FolderOpen className="w-4 h-4 mr-2" />
                      Templates
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass border-white/10">
                    <DialogHeader>
                      <DialogTitle>Schema Templates</DialogTitle>
                      <DialogDescription>
                        Load a pre-built schema template
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          setSchema(SAMPLE_SCHEMAS.ecommerce)
                        }}
                      >
                        <TableIcon className="w-4 h-4 mr-2" />
                        E-commerce (4 tables)
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex items-center gap-2 px-3 py-1 border border-border rounded-lg">
                  <Grid3x3 className="w-4 h-4 text-muted-foreground" />
                  <Switch checked={showGrid} onCheckedChange={setShowGrid} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setZoom(Math.max(50, zoom - 10))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground w-16 text-center">{zoom}%</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setZoom(Math.min(150, zoom + 10))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>

                <div className="w-px h-6 bg-border" />

                <Select value={sqlDialect} onValueChange={(v: any) => setSqlDialect(v)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="sqlite">SQLite</SelectItem>
                    <SelectItem value="sqlserver">SQL Server</SelectItem>
                  </SelectContent>
                </Select>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Code2 className="w-4 h-4 mr-2" />
                      Generate SQL
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="glass border-white/10 max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>Generated SQL ({sqlDialect})</DialogTitle>
                      <DialogDescription>
                        CREATE TABLE statements for your schema
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="relative">
                        <pre className="bg-card border border-border rounded-lg p-4 overflow-x-auto max-h-96">
                          <code className="text-primary text-sm font-mono">
                            {generateSQL()}
                          </code>
                        </pre>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => copyToClipboard(generateSQL())}
                        >
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={exportSQL} className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Download SQL
                        </Button>
                        <Button variant="outline" onClick={exportJSON} className="flex-1">
                          <FileJson className="w-4 h-4 mr-2" />
                          Export JSON
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Main Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Canvas */}
          <div className="lg:col-span-3">
            <Card className="glass border-white/10 p-4">
              <div
                ref={canvasRef}
                className="relative border-2 border-border rounded-lg overflow-hidden bg-card/30"
                style={{
                  height: "600px",
                  backgroundImage: showGrid
                    ? "radial-gradient(circle, rgba(16, 185, 129, 0.1) 1px, transparent 1px)"
                    : "none",
                  backgroundSize: showGrid ? "20px 20px" : "auto",
                  transform: `scale(${zoom / 100})`,
                  transformOrigin: "top left",
                }}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
              >
                {/* SVG for relationships */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {schema.relationships.map(rel => {
                    const fromTable = schema.tables.find(t => t.id === rel.fromTable)
                    const toTable = schema.tables.find(t => t.id === rel.toTable)

                    if (!fromTable || !toTable) return null

                    const fromX = fromTable.x + 150
                    const fromY = fromTable.y + 20
                    const toX = toTable.x
                    const toY = toTable.y + 20

                    return (
                      <g key={rel.id}>
                        <line
                          x1={fromX}
                          y1={fromY}
                          x2={toX}
                          y2={toY}
                          stroke="hsl(var(--primary) / 0.4)"
                          strokeWidth="2"
                          strokeDasharray={rel.type === "one-to-many" ? "0" : "5,5"}
                        />
                        {/* Arrow */}
                        <polygon
                          points={`${toX},${toY} ${toX + 8},${toY - 4} ${toX + 8},${toY + 4}`}
                          fill="hsl(var(--primary) / 0.4)"
                        />
                      </g>
                    )
                  })}
                </svg>

                {/* Tables */}
                {schema.tables.map(table => (
                  <motion.div
                    key={table.id}
                    className={`absolute glass border-white/10 rounded-lg shadow-lg cursor-move ${
                      selectedTable === table.id ? "ring-2 ring-primary" : ""
                    }`}
                    style={{
                      left: table.x,
                      top: table.y,
                      width: "300px",
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation()
                      handleMouseDown(e, table.id)
                      setSelectedTable(table.id)
                    }}
                    whileHover={{ scale: 1.02 }}
                  >
                    {/* Table Header */}
                    <div className="flex items-center justify-between p-3 border-b border-white/10 bg-primary/10">
                      <div className="flex items-center gap-2">
                        <TableIcon className="w-4 h-4 text-primary" />
                        <span className="font-bold text-primary">{table.name}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 hover:bg-red-500/20"
                        onClick={(e) => {
                          e.stopPropagation()
                          deleteTable(table.id)
                        }}
                      >
                        <Trash2 className="w-3 h-3 text-red-400" />
                      </Button>
                    </div>

                    {/* Columns */}
                    <div className="p-2 space-y-1 max-h-64 overflow-y-auto">
                      {table.columns.map(column => (
                        <div
                          key={column.id}
                          className={`flex items-center gap-2 p-2 rounded text-sm hover:bg-white/5 ${
                            column.primaryKey ? "text-primary" : "text-foreground"
                          }`}
                        >
                          {column.primaryKey && <Key className="w-3 h-3" />}
                          {column.foreignKey && <LinkIcon className="w-3 h-3 text-secondary" />}
                          <span className="font-mono flex-1">{column.name}</span>
                          <span className="text-xs text-muted-foreground">{column.type}</span>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {schema.tables.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                      <Database className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="text-lg">No tables yet</p>
                      <p className="text-sm mt-2">Click "Add Table" or load a template</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Properties Panel */}
          <div className="lg:col-span-1">
            <Card className="glass border-white/10 p-4">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-primary" />
                Properties
              </h3>

              {selectedTableData ? (
                <div className="space-y-4">
                  <div>
                    <Label>Table Name</Label>
                    <Input
                      value={selectedTableData.name}
                      onChange={(e) => {
                        setSchema(prev => ({
                          ...prev,
                          tables: prev.tables.map(t =>
                            t.id === selectedTable ? { ...t, name: e.target.value } : t
                          ),
                        }))
                      }}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Columns ({selectedTableData.columns.length})</Label>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditingTable(selectedTableData)
                          setShowColumnDialog(true)
                        }}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Add
                      </Button>
                    </div>

                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {selectedTableData.columns.map(column => (
                        <div
                          key={column.id}
                          className="p-2 border border-white/10 rounded-lg space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-medium">{column.name}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => deleteColumn(selectedTable!, column.id)}
                            >
                              <Trash2 className="w-3 h-3 text-red-400" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-1 flex-wrap">
                            <Badge variant="outline" className="text-xs">
                              {column.type}
                              {column.length ? `(${column.length})` : ""}
                            </Badge>
                            {column.primaryKey && (
                              <Badge variant="outline" className="text-xs text-primary">
                                PK
                              </Badge>
                            )}
                            {column.foreignKey && (
                              <Badge variant="outline" className="text-xs text-secondary">
                                FK
                              </Badge>
                            )}
                            {column.unique && (
                              <Badge variant="outline" className="text-xs text-amber-400">
                                UNIQUE
                              </Badge>
                            )}
                            {!column.nullable && (
                              <Badge variant="outline" className="text-xs text-red-400">
                                NOT NULL
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => deleteTable(selectedTable!)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Table
                  </Button>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <TableIcon className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">Select a table to view properties</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Add Table Dialog */}
        <Dialog open={showTableDialog} onOpenChange={setShowTableDialog}>
          <DialogContent className="glass border-white/10">
            <DialogHeader>
              <DialogTitle>Add New Table</DialogTitle>
              <DialogDescription>
                Create a new table in your schema
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Table Name</Label>
                <Input
                  value={newTableName}
                  onChange={(e) => setNewTableName(e.target.value)}
                  placeholder="users"
                  className="mt-2"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowTableDialog(false)}>
                Cancel
              </Button>
              <Button onClick={addTable} disabled={!newTableName}>
                Create Table
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Add Column Dialog */}
        <Dialog open={showColumnDialog} onOpenChange={setShowColumnDialog}>
          <DialogContent className="glass border-white/10 max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Column to {editingTable?.name}</DialogTitle>
              <DialogDescription>
                Define column properties
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Column Name</Label>
                <Input
                  value={newColumnData.name}
                  onChange={(e) => setNewColumnData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="column_name"
                  className="mt-2"
                />
              </div>

              <div>
                <Label>Data Type</Label>
                <Select
                  value={newColumnData.type}
                  onValueChange={(value) => setNewColumnData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SQL_TYPES.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(newColumnData.type === "VARCHAR" || newColumnData.type === "DECIMAL") && (
                <div>
                  <Label>Length/Precision</Label>
                  <Input
                    type="number"
                    value={newColumnData.length || ""}
                    onChange={(e) => setNewColumnData(prev => ({ ...prev, length: parseInt(e.target.value) || undefined }))}
                    placeholder="255"
                    className="mt-2"
                  />
                </div>
              )}

              <div>
                <Label>Default Value</Label>
                <Input
                  value={newColumnData.defaultValue || ""}
                  onChange={(e) => setNewColumnData(prev => ({ ...prev, defaultValue: e.target.value }))}
                  placeholder="NULL"
                  className="mt-2"
                />
              </div>

              <div className="col-span-2 grid grid-cols-2 gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newColumnData.nullable ?? true}
                    onChange={(e) => setNewColumnData(prev => ({ ...prev, nullable: e.target.checked }))}
                    className="rounded border-white/20"
                  />
                  <span className="text-sm">Nullable</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newColumnData.primaryKey ?? false}
                    onChange={(e) => setNewColumnData(prev => ({ ...prev, primaryKey: e.target.checked }))}
                    className="rounded border-white/20"
                  />
                  <span className="text-sm">Primary Key</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newColumnData.unique ?? false}
                    onChange={(e) => setNewColumnData(prev => ({ ...prev, unique: e.target.checked }))}
                    className="rounded border-white/20"
                  />
                  <span className="text-sm">Unique</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newColumnData.index ?? false}
                    onChange={(e) => setNewColumnData(prev => ({ ...prev, index: e.target.checked }))}
                    className="rounded border-white/20"
                  />
                  <span className="text-sm">Indexed</span>
                </label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowColumnDialog(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => editingTable && addColumn(editingTable.id)}
                disabled={!newColumnData.name}
              >
                Add Column
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
