package com.yin.yin.controller;

import com.yin.yin.common.PageResult;
import com.yin.yin.common.Result;
import com.yin.yin.model.Package;
import com.yin.yin.model.PackageType;
import com.yin.yin.service.PackageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 套餐控制器
 */
@RestController
@RequestMapping("/api/packages")
public class PackageController {

    @Autowired
    private PackageService packageService;

    /**
     * 获取套餐列表
     */
    @GetMapping("/list")
    public Result<?> listPackages(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer type,
            @RequestParam(defaultValue = "1") Integer pageNum,
            @RequestParam(defaultValue = "10") Integer pageSize) {

        PageResult<Package> pageResult = packageService.listPackages(keyword, type, pageNum, pageSize);
        return Result.success(pageResult);
    }

    /**
     * 获取套餐详情
     */
    @GetMapping("/detail/{id}")
    public Result<?> getPackageDetail(@PathVariable Long id) {
        Package pkg = packageService.getPackageDetail(id);
        if (pkg != null) {
            return Result.success(pkg);
        } else {
            return Result.failed("套餐不存在");
        }
    }

    /**
     * 获取套餐类型
     */
    @GetMapping("/types")
    public Result<?> getPackageTypes() {
        List<PackageType> types = packageService.getAllTypes();
        return Result.success(types);
    }

    /**
     * 添加套餐
     */
    @PostMapping
    public Result<?> addPackage(@RequestBody Package pkg) {
        int result = packageService.addPackage(pkg);
        if (result > 0) {
            return Result.success(null, "添加成功");
        } else {
            return Result.failed("添加失败");
        }
    }

    /**
     * 更新套餐
     */
    @PutMapping("/{id}")
    public Result<?> updatePackage(@PathVariable Long id, @RequestBody Package pkg) {
        pkg.setId(id);
        int result = packageService.updatePackage(pkg);
        if (result > 0) {
            return Result.success(null, "更新成功");
        } else {
            return Result.failed("更新失败");
        }
    }

    /**
     * 删除套餐
     */
    @DeleteMapping("/{id}")
    public Result<?> deletePackage(@PathVariable Long id) {
        int result = packageService.deletePackage(id);
        if (result > 0) {
            return Result.success(null, "删除成功");
        } else {
            return Result.failed("删除失败");
        }
    }
}
